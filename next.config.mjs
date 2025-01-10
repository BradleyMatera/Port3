/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Disable experimental features
    // webpackBuildWorker: false,
    // parallelServerBuildTraces: false,
    // parallelServerCompiles: false,
  },
};

export default nextConfig;