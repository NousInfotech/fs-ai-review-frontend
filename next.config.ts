import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - turbopack type might not be in the installed NextConfig definition yet
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
