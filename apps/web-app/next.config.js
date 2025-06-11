/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ai-fitness/shared-types',
    '@ai-fitness/ui-components',
    '@ai-fitness/utils',
    '@ai-fitness/api-client',
  ],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
