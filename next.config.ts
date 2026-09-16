import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.businessdayafrica.net";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./my-loader.js",
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;