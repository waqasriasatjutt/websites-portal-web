/**
 * GET /llms.txt — proxies to Odoo /wp/api/llms.
 * Emerging standard (2024+) for guiding AI crawlers / LLM assistants.
 */
export const runtime = 'edge';
const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

export async function GET(req: Request) {
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];
  try {
    const r = await fetch(`${ODOO_URL}/wp/api/llms?host=${encodeURIComponent(host)}`, {
      cache: 'no-store',
    });
    if (!r.ok) {
      return new Response('# llms.txt not configured', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
    const txt = await r.text();
    return new Response(txt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch {
    return new Response('# llms.txt error', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
