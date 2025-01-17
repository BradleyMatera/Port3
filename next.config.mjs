/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'i.scdn.co',
      'mosaic.scdn.co',
      'image-cdn-fa.spotifycdn.com',
      'image-cdn-ak.spotifycdn.com',
      'localhost',
      'cdn-images-1.medium.com',
      'platform-lookaside.fbsbx.com',
      'lh3.googleusercontent.com',
      'pbs.twimg.com',
      'avatars.githubusercontent.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'placekitten.com',
      'dummyimage.com',
      'gravatar.com',
      'pixabay.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
    ],
  },
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    optimizeCss: true,
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;