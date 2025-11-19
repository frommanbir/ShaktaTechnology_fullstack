import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains:['localhost', 'res.cloudinary.com']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
