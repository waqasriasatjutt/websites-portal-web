/**
 * Sandboxed plugin renderer.
 *
 * Serves an HTML page that:
 *   1. Loads React + ReactDOM globals
 *   2. Loads the plugin UMD bundle from `?bundle=` URL
 *   3. Mounts the exported React component with `?props=` JSON
 *
 * The iframe in PluginIframe.tsx renders this with sandbox="allow-scripts
 * allow-forms allow-popups allow-same-origin", giving the plugin a real
 * window but isolating it from the parent page DOM/cookies.
 */
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function escape(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ plugin: string; block: string }> }) {
  const { plugin, block } = await ctx.params;
  const url = new URL(req.url);
  const bundle = url.searchParams.get('bundle') || '';
  const mount = url.searchParams.get('mount') || 'default';
  let propsObj: any = {};
  try { propsObj = JSON.parse(url.searchParams.get('props') || '{}'); } catch {}

  // Allow-list of trusted plugin bundle origins. Keeps SSRF + drive-by malicious
  // bundle injection from happening if an attacker manages to spoof a manifest.
  const ALLOWED_ORIGINS = [
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
    'https://cdn.skypack.dev',
    'https://esm.sh',
  ];
  let bundleUrl: URL;
  try {
    bundleUrl = new URL(bundle);
  } catch {
    return new Response('Invalid bundle URL', { status: 400 });
  }
  if (bundleUrl.protocol !== 'https:') {
    return new Response('Bundle must be served over HTTPS', { status: 400 });
  }
  const originAllowed =
    ALLOWED_ORIGINS.includes(bundleUrl.origin) ||
    bundleUrl.hostname.endsWith('.pages.dev') ||
    bundleUrl.hostname.endsWith('.way4tech.com') ||
    bundleUrl.hostname === 'cynxsolutions.com' ||
    bundleUrl.hostname.endsWith('.cynxsolutions.com');
  if (!originAllowed) {
    return new Response(`Bundle origin not allowed: ${bundleUrl.origin}`, { status: 400 });
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escape(plugin)} / ${escape(block)}</title>
<style>
  html, body { margin: 0; padding: 0; height: auto; background: transparent; }
  body { font-family: Inter, system-ui, sans-serif; }
  #wp-plugin-mount { padding: 0; }
  .wp-plugin-err { padding: 16px; color: #b91c1c; font-family: monospace; font-size: 13px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 6px; margin: 12px; }
</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
<div id="wp-plugin-mount"></div>
<script id="wp-plugin-props" type="application/json">${escape(JSON.stringify(propsObj))}</script>
<script src="${escape(bundle)}"
        onerror="document.body.innerHTML='<div class=&quot;wp-plugin-err&quot;>Failed to load bundle: ' + ${JSON.stringify(escape(bundle))} + '</div>'">
</script>
<script>
(function () {
  function showError(msg) {
    var d = document.createElement('div');
    d.className = 'wp-plugin-err';
    d.textContent = 'Plugin error: ' + msg;
    document.body.appendChild(d);
  }
  function getComponent(name) {
    if (window[name]) {
      var c = window[name];
      return c && (c.default || c);
    }
    if (window.WP_PLUGIN) {
      return window.WP_PLUGIN[name] || (window.WP_PLUGIN.default && window.WP_PLUGIN.default[name]);
    }
    return null;
  }
  function boot() {
    var Comp = getComponent(${JSON.stringify(mount)});
    if (!Comp) {
      showError('No export "${escape(mount)}" found in bundle.');
      return;
    }
    try {
      var props = JSON.parse(document.getElementById('wp-plugin-props').textContent || '{}');
      var mount = document.getElementById('wp-plugin-mount');
      var root = ReactDOM.createRoot ? ReactDOM.createRoot(mount) : null;
      var el = React.createElement(Comp, props);
      if (root) { root.render(el); } else { ReactDOM.render(el, mount); }
      reportHeight();
    } catch (e) {
      showError(e.message || String(e));
    }
  }
  // Tell the parent how tall to make the iframe — once on mount, then on any
  // ResizeObserver change to the body.
  function reportHeight() {
    function emit() {
      if (!window.parent) return;
      var h = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, 120);
      try { window.parent.postMessage({ type: 'plugin:resize', height: h }, '*'); } catch (_) {}
    }
    emit();
    if (typeof ResizeObserver !== 'undefined') {
      try { new ResizeObserver(emit).observe(document.body); } catch (_) {}
    }
    setTimeout(emit, 200);
    setTimeout(emit, 800);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 80);
  } else {
    window.addEventListener('DOMContentLoaded', boot);
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
      // Allow embedding only from portal-managed parent origins.
      'Content-Security-Policy':
        "frame-ancestors 'self' https://*.way4tech.com https://*.pages.dev https://cynxsolutions.com https://*.cynxsolutions.com;",
    },
  });
}
