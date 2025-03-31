import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
  afterAuth(auth, req) {
    // Handle specific redirects for sign-in and sign-up
    if (!auth.userId && req.nextUrl.pathname === '/sign-in') {
      const signInUrl = new URL('/sign-in/', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    if (!auth.userId && req.nextUrl.pathname === '/sign-up') {
      const signUpUrl = new URL('/sign-up/', req.url);
      return NextResponse.redirect(signUpUrl);
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
