import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling these packages — they must use native Node.js require()
  // sharp is already on Next.js's automatic list; basic-ftp needs explicit entry
  serverExternalPackages: ["basic-ftp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
