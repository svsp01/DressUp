import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const url = request.nextUrl.clone();

  const staticAssetPaths = ['/static/', '/assets/', '/_next/', '/favicon.ico']; 
  const apiRoutes = ['/api/'];

  if (staticAssetPaths.some(path => request.nextUrl.pathname.startsWith(path)) ||
      apiRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const publicRoutes = ['/login', '/'];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    if (token) {
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  } else {
    if (token) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/', '/:path*'], // Apply middleware to all routes except static assets and API routes
};
