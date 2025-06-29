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

  // Bundle analyzer (uncomment for debugging)
  // experimental: {
  //   bundlePagesExternals: true,
  // },

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

  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/IKofPtuWtzCFF1OLH7356g/**',
      },
    ],
    // Optimize image formats
    formats: ['image/webp', 'image/avif'],
    // Image optimization settings
    quality: 80,
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
  bundleServerPackages: ['payload', '@payloadcms/ui'],
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
