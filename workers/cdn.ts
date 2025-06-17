import type { ExecutionContext } from '@cloudflare/workers-types'

interface Env {
  // Add your environment variables here
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Cache control
    const cacheKey = new Request(url.toString(), request)
    const cache = await caches.open('cdn-cache')
    let response = await cache.match(cacheKey)

    if (!response) {
      // Fetch from origin
      response = await fetch(request)

      // Clone the response so we can modify headers
      response = new Response(response.body, response)

      // Set cache headers
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, stale-while-revalidate=86400',
      )

      // Store in cache
      ctx.waitUntil(cache.put(cacheKey, response.clone()))
    }

    // Add security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
  },
}
