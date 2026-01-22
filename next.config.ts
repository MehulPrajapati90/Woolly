import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['utfs.io', 'ui-avatars.com']
  }
};

export default nextConfig;
