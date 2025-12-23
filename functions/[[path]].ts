/**
 * Catch-all function to serve Next.js pages
 * This handles all non-API routes and serves the appropriate HTML
 */

export async function onRequest(context: any) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Don't handle API routes (handled by functions/api/[[path]].ts)
  if (pathname.startsWith('/api/')) {
    return next();
  }

  // Don't handle static assets (handled by Cloudflare Pages)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    return next();
  }

  // For all other routes, try to serve index.html (client-side routing)
  // Cloudflare Pages will handle static HTML files automatically
  return next();
}


