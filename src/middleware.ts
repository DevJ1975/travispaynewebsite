import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 301s from the legacy Duda URLs to the new routes, to preserve SEO at cutover
// (doc 01 §2, doc 05 C5). Add new mappings here as content is migrated.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/read-more': '/about',
  '/teams': '/team',
  '/category/dance-entertainment': '/productions',
  '/hiras---landing-page': '/hiras',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const redirectTarget = LEGACY_REDIRECTS[pathname];
  if (redirectTarget) {
    return NextResponse.redirect(new URL(redirectTarget, request.url), { status: 301 });
  }

  // Admin auth guard: require a session cookie for everything except the login page.
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('__session')?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/read-more', '/teams', '/hiras---landing-page', '/category/:path*', '/admin/:path*'],
};
