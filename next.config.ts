import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cjsvqyjrjmyeiijykpru.supabase.co',
      },
    ],
  },
}

export default nextConfig
