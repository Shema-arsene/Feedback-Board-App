import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables ESLint errors on Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ disables TS errors during build
  },
}

export default nextConfig
