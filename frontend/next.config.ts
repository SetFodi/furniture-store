// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options you might add later */
  images: {
    remotePatterns: [
      {
        protocol: "https", // Protocol used by the image source
        hostname: "placehold.co", // The allowed domain
        port: "", // Usually empty for default ports (80/443)
        pathname: "/**", // Allows any path on the domain (e.g., /600x400/...)
      },
      // Add other patterns here if needed in the future
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-domain.com',
      // },
    ],
  },
};

export default nextConfig;
