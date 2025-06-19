import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimizations
  compress: true,

  // Bundle analyzer (uncomment for debugging)
  // experimental: {
  //   bundlePagesExternals: true,
  // },

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
