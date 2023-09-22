/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    serverActions: true,
    // enableUndici: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
