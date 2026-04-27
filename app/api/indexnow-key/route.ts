/**
 * GET /api/indexnow-key?key=<requested-key>
 *
 * Validates the IndexNow key file request. The middleware rewrites
 * `/<32-hex>.txt` requests to this route. We fetch the site config
 * for the host, and if the requested key matches the site's
 * indexnow_key, we serve the key as plain text (IndexNow spec).
 *
 * Otherwise 404 — IndexNow rejects pings whose key file is missing.
 */
export const runtime = 'edge';
const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedKey = (url.searchParams.get('key') || '').trim();
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];

  if (!requestedKey || !host) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const r = await fetch(`${ODOO_URL}/wp/api/site?host=${encodeURIComponent(host)}`, {
      cache: 'no-store',
    });
    if (!r.ok) return new Response('Not found', { status: 404 });
    const data: any = await r.json();
    const siteKey = data?.site?.indexnow_key || '';
    if (!siteKey || siteKey !== requestedKey) {
      return new Response('Not found', { status: 404 });
    }
    // IndexNow spec: serve the key value as plain text
    return new Response(siteKey, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
