import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/IKofPtuWtzCFF1OLH7356g/**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()

// First apply next-intl, then Payload
export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
