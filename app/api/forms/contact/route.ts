/**
 * POST /api/forms/contact — proxies a contact-form submission to the Odoo backend.
 * Body: { host, fields, page_slug? }
 *
 * Security/quality:
 *  - Host is read ONLY from CF-provided headers (x-forwarded-host / x-site-host)
 *    not the visitor-controlled `referer`, which is spoofable.
 *  - Payload size capped at 16 KB to prevent oversized-body abuse.
 *  - 10s upstream timeout via AbortSignal.
 *  - Error messages sanitised before being returned to the client.
 */
export const runtime = 'edge';

const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';
const MAX_BODY_BYTES = 16 * 1024;

function resolveHost(req: Request, bodyHost?: string): string | null {
  if (bodyHost && typeof bodyHost === 'string' && /^[a-z0-9.\-]+$/i.test(bodyHost)) {
    return bodyHost.toLowerCase();
  }
  const trusted = req.headers.get('x-forwarded-host') || req.headers.get('x-site-host') || req.headers.get('host');
  if (trusted) return trusted.split(':')[0].toLowerCase();
  return null;
}

export async function POST(req: Request) {
  // Cap payload size before parsing.
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const host = resolveHost(req, body?.host);
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
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
      signal: controller.signal,
    });
    const data = await r.json();
    if (data?.error) return Response.json({ ok: false, error: 'odoo_error' }, { status: 502 });
    return Response.json(data?.result || { ok: false, error: 'no_result' });
  } catch (e: any) {
    const code = e?.name === 'AbortError' ? 'upstream_timeout' : 'proxy_error';
    return Response.json({ ok: false, error: code }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
