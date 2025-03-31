import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',                     // Homepage
    '/api(.*)',              // API routes
    '/favicon.ico',          // Favicon
    '/images(.*)',           // Public images
    '/_next/(.*)',           // Next.js assets
  ],
  
  // Handle redirects for unauthenticated users
  afterAuth(auth, req) {
    // If the user is not signed in and the route is not public, redirect to Clerk's hosted sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('https://accounts.tigertalk.app/sign-in');
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
