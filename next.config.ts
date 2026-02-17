import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use this project as the root (avoids picking up C:\Users\Santa\package-lock.json)
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
