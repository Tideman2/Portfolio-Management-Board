import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Project images are capped at 5 MB client-side; leave room for the
      // multipart envelope and other form fields.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
