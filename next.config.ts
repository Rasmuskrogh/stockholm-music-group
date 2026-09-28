import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use this project as the root (avoids picking up C:\Users\Santa\package-lock.json)
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async redirects() {
    // The old admin area is replaced by the embedded Sanity Studio.
    return [{ source: "/admin/:path*", destination: "/studio", permanent: true }];
  },
};

export default nextConfig;
