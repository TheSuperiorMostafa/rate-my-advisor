/**
 * Cloudflare Pages Function to proxy API requests to Vercel backend
 * Handles all /api/* routes
 */

export async function onRequest(context: any) {
  const { request, params } = context;
  const url = new URL(request.url);
  
  // Get the API path
  const apiPath = params.path ? `/${params.path.join('/')}` : '';
  const fullPath = `/api${apiPath}${url.search}`;
  
  // Vercel backend URL - update this to your actual Vercel deployment URL
  const vercelUrl = `https://rate-my-advisor.vercel.app${fullPath}`;
  
  try {
    // Forward the request to Vercel
    const response = await fetch(vercelUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'Host': 'rate-my-advisor.vercel.app',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'X-Forwarded-Proto': url.protocol.slice(0, -1),
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.clone().arrayBuffer() 
        : undefined,
    });
    
    // Create response with CORS headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    
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
