import { NextResponse, type NextRequest } from 'next/server';

const ODOO_URL = process.env.ODOO_URL || 'https://portal.way4tech.com';

// IndexNow key files: 8-128 hex chars + .txt at the root path.
const INDEXNOW_KEY_RE = /^\/([a-f0-9]{16,128})\.txt$/i;

// In-memory redirect cache (per Worker instance, ~5 min TTL).
type RedirectRule = { from: string; to: string; code: number };
const redirectCache = new Map<string, { fetched: number; rules: RedirectRule[] }>();
const REDIRECT_TTL_MS = 5 * 60 * 1000;

async function fetchRedirects(host: string): Promise<RedirectRule[]> {
  const cached = redirectCache.get(host);
  if (cached && Date.now() - cached.fetched < REDIRECT_TTL_MS) {
    return cached.rules;
  }
  try {
    const r = await fetch(`${ODOO_URL}/wp/api/redirects?host=${encodeURIComponent(host)}`, {
      cache: 'no-store',
    });
    if (!r.ok) return [];
    const data: any = await r.json();
    const rules: RedirectRule[] = Array.isArray(data?.redirects) ? data.redirects : [];
    redirectCache.set(host, { fetched: Date.now(), rules });
    return rules;
  } catch {
    return [];
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(':')[0];

  // ── IndexNow key file proxy ────────────────────────────────────
  const m = path.match(INDEXNOW_KEY_RE);
  if (m) {
    const url = req.nextUrl.clone();
    url.pathname = '/api/indexnow-key';
    url.searchParams.set('key', m[1]);
    return NextResponse.rewrite(url);
  }

  // ── 301 redirects (slug-rename hook) ───────────────────────────
  // Only check for paths that look like content (not API/static).
  if (host && !path.startsWith('/api/') && !path.startsWith('/_next/') && !path.startsWith('/widgets/')) {
    const rules = await fetchRedirects(host);
    if (rules.length > 0) {
      const hit = rules.find(r => r.from === path);
      if (hit) {
        const target = hit.to.startsWith('http') ? hit.to : new URL(hit.to, req.nextUrl).toString();
        return NextResponse.redirect(target, hit.code === 302 ? 302 : 301);
      }
    }
  }

  const res = NextResponse.next();

  // Allow embedding in Odoo admin for the live-preview iframe.
  res.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://portal.way4tech.com https://*.way4tech.com"
  );
  res.headers.delete('X-Frame-Options');

  return res;
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
