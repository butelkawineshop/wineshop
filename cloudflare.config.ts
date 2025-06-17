interface CloudflareConfig {
  cloudflare: {
    accountId: string | undefined
    apiToken: string | undefined
    zoneId: string | undefined
    domain: string | undefined
  }
  cache: {
    staticAssets: {
      maxAge: number
      staleWhileRevalidate: number
    }
    apiResponses: {
      maxAge: number
      staleWhileRevalidate: number
    }
  }
  security: {
    headers: Record<string, string>
  }
  images: {
    formats: string[]
    sizes: number[]
    quality: number
  }
}

const config: CloudflareConfig = {
  // Cloudflare configuration
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    domain: process.env.CLOUDFLARE_DOMAIN,
  },

  // Cache settings
  cache: {
    // Cache static assets for 1 year
    staticAssets: {
      maxAge: 31536000,
      staleWhileRevalidate: 86400,
    },
    // Cache API responses for 1 hour
    apiResponses: {
      maxAge: 3600,
      staleWhileRevalidate: 300,
    },
  },

  // Security headers
  security: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  // Image optimization
  images: {
    formats: ['webp', 'avif'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    quality: 80,
  },
}

export default config
