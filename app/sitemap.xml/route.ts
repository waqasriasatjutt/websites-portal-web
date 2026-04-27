/**
 * GET /sitemap.xml — proxies to Odoo /wp/api/sitemap?format=xml.
 * One sitemap per host (per-tenant).
 */
export const runtime = 'edge';
const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

export async function GET(req: Request) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];
  try {
    const r = await fetch(`${ODOO_URL}/wp/api/sitemap?host=${encodeURIComponent(host)}&format=xml`, {
      cache: 'no-store',
    });
    if (!r.ok) {
      return new Response('Sitemap unavailable', { status: 503 });
    }
    const xml = await r.text();
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600',
      },
    });
  } catch {
    return new Response('Sitemap error', { status: 503 });
  }
}
