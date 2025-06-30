import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

// Cloudflare configuration
const cloudflareConfig = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  zoneId: process.env.CLOUDFLARE_ZONE_ID,
  domain: process.env.CLOUDFLARE_DOMAIN,
}

// Cache settings
const cacheConfig = {
  staticAssets: {
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 1 day
  },
  apiResponses: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 300, // 5 minutes
  },
}

// Security headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimizations
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ]
  },

  // Image optimizations (simplified for Cloudflare Images)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/IKofPtuWtzCFF1OLH7356g/**',
      },
    ],
    // Minimal config since Cloudflare handles optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable Next.js optimization since Cloudflare handles it
    unoptimized: false, // Keep false to use Next.js Image component benefits
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          payload: {
            test: /[\\/]node_modules[\\/]@payloadcms[\\/]/,
            name: 'payload',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }

    return config
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@payloadcms/ui', 'next-intl'],
  },

  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

const withNextIntl = createNextIntlPlugin()

const baseConfig = withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
  // Optimize Payload bundle
  bundleServerPackages: ['payload'],
})

export default async () => {
  if (process.env.ANALYZE === 'true') {
    const { default: withBundleAnalyzer } = await import('@next/bundle-analyzer')
    return withBundleAnalyzer({ enabled: true })(baseConfig)
  }
  return baseConfig
}

// Export config for use in other parts of the application
export { cloudflareConfig, cacheConfig, securityHeaders }
