/**
 * Cloudflare Pages Middleware
 * Proxies API requests to Vercel backend
 */

export async function onRequest(context: any) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Proxy API routes to Vercel backend
  if (url.pathname.startsWith('/api/')) {
    const vercelUrl = `https://rate-my-advisor.vercel.app${url.pathname}${url.search}`;
    
    try {
      const response = await fetch(vercelUrl, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          'Host': 'rate-my-advisor.vercel.app',
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.clone().arrayBuffer() 
          : undefined,
      });
      
      // Return response with CORS headers
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
        JSON.stringify({ error: 'Backend service unavailable' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // For non-API routes, continue with Next.js
  return next();
}

