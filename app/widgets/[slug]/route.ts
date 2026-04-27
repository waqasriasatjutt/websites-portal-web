/**
 * GET /widgets/<slot>.html — serves the widget HTML for a given slot.
 *
 * The widget itself is loaded inside a sandboxed iframe by the ReactWidget
 * block. Each tenant can have a different widget per slot — looked up by
 * (host, slot_name).
 *
 * For now: serves a minimal scaffold with React UMD + a window.WP_PROPS
 * object the widget code can consume. Widget JS is delivered as a
 * `websites.portal.site.widget` record stored in Odoo (added in this round).
 */
export const runtime = 'edge';

const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  // Strip .html if present (route catches /widgets/foo.html via slug='foo.html')
  const slot = slug.replace(/\.html$/, '');
  const url = new URL(req.url);
  const host = url.searchParams.get('host') || req.headers.get('x-site-host') || '';
  const propsParam = url.searchParams.get('props') || '{}';

  // Fetch the widget source from Odoo
  let widgetSource = '';
  let widgetMissing = false;
  try {
    const r = await fetch(`${ODOO_URL}/wp/api/widget?host=${encodeURIComponent(host)}&slot=${encodeURIComponent(slot)}`, {
      cache: 'no-store',
    });
    const data: any = await r.json();
    if (data?.ok && data?.source) widgetSource = data.source;
    else widgetMissing = true;
  } catch {
    widgetMissing = true;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Widget: ${escapeHtml(slot)}</title>
  <style>
    html, body { margin: 0; padding: 0; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    body { padding: 1rem; background: transparent; color: inherit; }
    .placeholder { text-align: center; padding: 2rem; border: 2px dashed #d1d5db; border-radius: 8px; color: #6b7280; }
    .placeholder code { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.WP_PROPS = ${propsParam};
    window.WP_HOST  = ${JSON.stringify(host)};
    window.WP_SLOT  = ${JSON.stringify(slot)};
  </script>
  ${widgetMissing ? `
  <div class="placeholder">
    <h3>Widget slot <code>${escapeHtml(slot)}</code></h3>
    <p>No widget published for this slot yet. Publish one in
    <strong>Odoo → Websites Portal → Sites → Custom Code → Widgets</strong>.</p>
  </div>
  ` : `
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script>
    try {
      ${widgetSource}
    } catch (e) {
      document.getElementById('root').innerHTML =
        '<div class="placeholder">Widget error: ' + (e.message || e) + '</div>';
    }
  </script>
  `}
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      // Allow embedding in iframe of the same parent (sites.way4tech.com etc.)
      'Content-Security-Policy': "frame-ancestors *",
      'X-Frame-Options': 'ALLOWALL',
    },
  });
}
