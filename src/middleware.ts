import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import type { NextRequestWithAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    try {
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/collecte/:path*',
    '/pretraitement/:path*',
    '/recherche/:path*',
    '/rapports/:path*',
    '/parametres/:path*',
    '/kpi/:path*',
  ],
}; 