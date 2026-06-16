import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["basic-ftp"],

  logging: {
    // Forward browser console.log / warn / error to the terminal in dev
    browserToTerminal: true,
    // Next.js 16 already logs server function calls and incoming requests.
    // We suppress only noisy _next internals via the matcher in proxy.ts.
  },

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
