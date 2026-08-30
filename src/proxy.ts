import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/chat', '/documents', '/shared', '/workspaces', '/profile', '/settings'];
const authRoutes = ['/login', '/register'];

export default function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const isLoggedIn = req.cookies.has('authjs.session-token') || req.cookies.has('__Secure-authjs.session-token');

  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/chat', nextUrl));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
