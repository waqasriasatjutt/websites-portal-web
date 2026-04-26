/**
 * POST /api/forms/contact — proxies a contact-form submission to the Odoo backend.
 * Body: { host, fields, page_slug? }
 */
export const runtime = 'edge';

const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const host =
    body.host ||
    req.headers.get('x-site-host') ||
    new URL(req.headers.get('referer') || `https://${req.headers.get('host')}/`).hostname;

  if (!host) {
    return Response.json({ ok: false, error: 'host_required' }, { status: 400 });
  }
  const fields = body.fields || {};
  const page_slug = body.page_slug || '';

  try {
    const r = await fetch(`${ODOO_URL}/wp/api/forms/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: { host, kind: 'contact', fields, page_slug },
      }),
      cache: 'no-store',
    });
    const data = await r.json();
    if (data?.error) return Response.json({ ok: false, error: 'odoo_error' }, { status: 502 });
    return Response.json(data?.result || { ok: false, error: 'no_result' });
  } catch (e: any) {
    return Response.json({ ok: false, error: 'proxy_error', detail: String(e?.message || e) }, { status: 502 });
  }
}
