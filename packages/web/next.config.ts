import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    images: {
      domains: ["images.unsplash.com", "res.cloudinary.com"],
    },
  }
};

export default nextConfig;
