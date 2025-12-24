/**
 * Cloudflare Pages Middleware
 * Proxies API requests to Vercel backend
 * This runs first and handles all /api/* routes
 */

export async function onRequest(context: any) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Proxy API routes to Vercel backend
  if (url.pathname.startsWith('/api/')) {
    const vercelUrl = `https://rate-my-advisor.vercel.app${url.pathname}${url.search}`;
    
    try {
      // Forward the request to Vercel
      // Preserve original host for OAuth callbacks
      const originalHost = request.headers.get('Host') || url.host;
      const headers = new Headers(request.headers);
      
      // Forward original host so NextAuth can determine correct base URL
      headers.set('X-Forwarded-Host', originalHost);
      headers.set('X-Forwarded-Proto', url.protocol.slice(0, -1));
      headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
      
      // Don't override Host header - let Vercel use it for routing
      // But set it to the original domain for OAuth callbacks
      headers.set('Host', originalHost);
      
      const response = await fetch(vercelUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' 
          ? await request.clone().arrayBuffer() 
          : undefined,
      });
      
      // Create response with CORS headers
      // For OAuth, we need to preserve cookies and set proper CORS
      const responseHeaders = new Headers(response.headers);
      
      // Get the origin from the request for CORS
      const origin = request.headers.get('Origin') || `https://${originalHost}`;
      
      // When using credentials, can't use wildcard - must specify origin
      responseHeaders.set('Access-Control-Allow-Origin', origin);
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, Set-Cookie');
      responseHeaders.set('Access-Control-Allow-Credentials', 'true');
      
      // Fix cookie domain for OAuth - ensure cookies work across Cloudflare proxy
      // Cookies set by Vercel need to be accessible from Cloudflare domain
      const setCookieHeaders = responseHeaders.getSetCookie();
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        responseHeaders.delete('Set-Cookie');
        const customDomain = originalHost.includes('rate-my-advisor.com') 
          ? 'rate-my-advisor.com' 
          : originalHost.split(':')[0];
        
        setCookieHeaders.forEach(cookie => {
          let fixedCookie = cookie;
          
          // Remove any existing Domain= setting
          fixedCookie = fixedCookie.replace(/;\s*Domain=[^;]+/gi, '');
          
          // Remove any Vercel domain references
          fixedCookie = fixedCookie.replace(/Domain=rate-my-advisor[^;]+/gi, '');
          
          // Add correct domain for custom domain
          if (customDomain.includes('rate-my-advisor.com')) {
            // For custom domain, set domain explicitly
            fixedCookie = `${fixedCookie}; Domain=${customDomain}`;
          }
          // If not custom domain, let it default (no Domain= means request domain)
          
          responseHeaders.append('Set-Cookie', fixedCookie);
        });
      }
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error('API proxy error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Backend service unavailable',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        { 
          status: 503,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
  }
  
  // For non-API routes, continue with Next.js static files
  return next();
}

