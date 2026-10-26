import { NextRequest, NextResponse } from 'next/server';

// Routes each page to its portal domain (admin vs student). Both URLs are baked in at build time;
// when either is missing (local dev) every page is served on any host.
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
const STUDENT_URL = process.env.NEXT_PUBLIC_STUDENT_URL;

// Auth pages that only exist for students: sign-up and the Google OAuth callback
const STUDENT_ONLY_AUTH_PATHS = ['/auth/register', '/auth/login/google'];

export function proxy(request: NextRequest) {
  if (!ADMIN_URL || !STUDENT_URL) return NextResponse.next();

  // Nginx forwards the original Host header
  const hostname = (request.headers.get('host') ?? '').split(':')[0];
  const { pathname, search } = request.nextUrl;
  const onAdminPortal = hostname === new URL(ADMIN_URL).hostname;

  if (onAdminPortal) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin/overview', ADMIN_URL));
    }
    const isAdminAuthPage =
      pathname.startsWith('/auth') && !STUDENT_ONLY_AUTH_PATHS.some((p) => pathname.startsWith(p));
    if (pathname.startsWith('/admin') || isAdminAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(pathname + search, STUDENT_URL));
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL(pathname + search, ADMIN_URL));
  }
  return NextResponse.next();
}

export const config = {
  // Pages only: skip Next internals, API calls and static files
  matcher: ['/((?!_next/|api/|favicon.ico|.*\\..*).*)'],
};
