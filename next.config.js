/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
  },
  // 性能优化配置
  compress: true,
  poweredByHeader: false,
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // HTTP 缓存头配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/(.*).js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*).css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig