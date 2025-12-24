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
      
      // Ensure cookies are forwarded - critical for OAuth PKCE
      // Cookies from the browser need to be sent to Vercel
      const cookieHeader = request.headers.get('Cookie');
      if (cookieHeader) {
        headers.set('Cookie', cookieHeader);
      }
      
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
      
      // CRITICAL: Fix cookie domain for OAuth PKCE to work across Cloudflare proxy
      // Vercel sets cookies, but they need to work on Cloudflare domain
      const setCookieHeaders = responseHeaders.getSetCookie();
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        responseHeaders.delete('Set-Cookie');
        const customDomain = originalHost.includes('rate-my-advisor.com') 
          ? 'rate-my-advisor.com' 
          : originalHost.split(':')[0];
        
        setCookieHeaders.forEach(cookie => {
          let fixedCookie = cookie;
          
          // Remove ALL existing Domain= settings (including Vercel domain)
          fixedCookie = fixedCookie.replace(/;\s*Domain=[^;]+/gi, '');
          
          // For custom domain, explicitly set domain to ensure cookies work
          // This is critical for PKCE code verifier cookie
          if (customDomain.includes('rate-my-advisor.com')) {
            // Set domain explicitly for the custom domain
            // This ensures cookies are accessible when Google redirects back
            fixedCookie = `${fixedCookie}; Domain=${customDomain}; Path=/`;
            
            // Ensure SameSite is set correctly for OAuth
            if (!fixedCookie.includes('SameSite=')) {
              fixedCookie = `${fixedCookie}; SameSite=Lax`;
            }
            
            // Ensure Secure is set for HTTPS
            if (process.env.NODE_ENV === 'production' && !fixedCookie.includes('Secure')) {
              fixedCookie = `${fixedCookie}; Secure`;
            }
          }
          
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

