import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import path from "path";

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
  outputFileTracingRoot: path.join(__dirname, "../"),
  // Boundary GeoJSON lives outside `public/`; ensure it ships with the
  // standalone build so the route handler can stream it at runtime.
  outputFileTracingIncludes: {
    "/api/location/boundaries/[region]": ["./boundaries/**"],
  },
  async headers() {
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains; preload",
            },
          ],
        },
      ];
    } else {
      return [];
    }
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {},
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
