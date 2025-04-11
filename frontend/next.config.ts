// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Ensure this is present
        port: "",
        pathname: "/**",
      },
      // Add any other hostnames if needed
    ],
  },
};

export default nextConfig;
