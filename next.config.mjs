/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['image-cdn-fa.spotifycdn.com', 'localhost', 'mosaic.scdn.co', 'i.scdn.co'], // Add your allowed image domains here
  },
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;