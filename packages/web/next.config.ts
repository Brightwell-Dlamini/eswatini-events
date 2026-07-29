import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // Avoid build failures from optional env during static analysis
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ship even if legacy files have lint noise; fix incrementally
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
