import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains:['localhost', 'res.cloudinary.com', '127.0.0.1']
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
