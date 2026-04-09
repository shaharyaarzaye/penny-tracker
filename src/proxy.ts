import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);

  let payload = null;
  if (sessionToken) {
    payload = await verifyJWT(sessionToken);
  }

  const isAuthenticated = !!payload;

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Mutate request headers cleanly
  const requestHeaders = new Headers(request.headers);
  if (isAuthenticated && payload) {
    requestHeaders.set('x-user-id', payload.userId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
