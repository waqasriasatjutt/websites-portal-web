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
  // Accept both shapes:
  //   { host, fields: {name, email, ...}, page_slug }  (renderer block)
  //   { host, name, email, message, ... }              (theme-side flat form)
  let fields = body.fields;
  if (!fields || typeof fields !== 'object' || Object.keys(fields).length === 0) {
    const { host: _h, fields: _f, page_slug: _ps, jsonrpc: _j, method: _m, params: _p, ...rest } = body;
    fields = rest;
  }
  const kind = body.kind || 'contact';
  const page_slug = body.page_slug || body._url || '';

  try {
    const r = await fetch(`${ODOO_URL}/wp/api/forms/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: { host, kind, fields, page_slug },
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
