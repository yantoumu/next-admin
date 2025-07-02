/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
  },
}

module.exports = nextConfig