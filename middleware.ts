import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
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
  matcher: ['/((?!api/|_next/|favicon.ico).*)'],
};
