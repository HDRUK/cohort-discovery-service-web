import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    authInterrupts: true,
  },
  transpilePackages: ["@faker-js/faker"],
};

export default nextConfig;
