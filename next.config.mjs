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
      'image-cdn-fa.spotifycdn.com', 
      'localhost', 
      'mosaic.scdn.co', 
      'i.scdn.co', 
      'image-cdn-ak.spotifycdn.com', 
      'cdn-images-1.medium.com', // Commonly used for blog images
      'platform-lookaside.fbsbx.com', // Facebook profile images
      'lh3.googleusercontent.com', // Google profile images
      'pbs.twimg.com', // Twitter profile images
      'avatars.githubusercontent.com', // GitHub profile images
      'res.cloudinary.com', // Cloudinary images
      'images.unsplash.com', // Unsplash images
      'placekitten.com', // Placeholder images (if needed)
      'dummyimage.com', // Placeholder dummy images
      'gravatar.com', // Gravatar profile images
      'pixabay.com', // Pixabay images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  reactStrictMode: true, // Enable React Strict Mode
  trailingSlash: false, // Ensure consistent URL handling
  experimental: {
    optimizeCss: true, // Optimize CSS for faster builds
    appDir: true, // Support for the new app directory structure
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Avoid "fs" module errors in browser environments
    };
    return config;
  },
};

export default nextConfig;