import { authMiddleware } from '@clerk/nextjs';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  // Only make public routes public
  publicRoutes: [
    '/',                     // Homepage
    '/sign-in(.*)',          // All sign-in routes
    '/sign-up(.*)',          // All sign-up routes
    '/api(.*)',              // API routes
    '/_next/static(.*)',     // Next.js static files
    '/favicon.ico',          // Favicon
    '/images(.*)',           // Public images
  ],
  
  // Return true to continue, false to deny access
  afterAuth(auth, req) {
    // Always allow access to public routes
    if (req.nextUrl.pathname === '/' || 
        req.nextUrl.pathname.startsWith('/sign-in') || 
        req.nextUrl.pathname.startsWith('/sign-up')) {
      return;
    }
    
    // If trying to access protected routes and not authenticated, redirect to sign-in
    if (!auth.userId && 
        (req.nextUrl.pathname.startsWith('/dashboard') || 
         req.nextUrl.pathname.startsWith('/record') || 
         req.nextUrl.pathname.startsWith('/recording'))) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
