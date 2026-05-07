/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/crea',
  assetPrefix: '/crea',
  images: { unoptimized: true },
  transpilePackages: ['recharts'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://indicecrea-backend:8000'}/:path*`
      }
    ]
  },
}
module.exports = nextConfig
