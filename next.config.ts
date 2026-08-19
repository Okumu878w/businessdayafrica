import type { NextConfig } from "next";

// Read the API host from env so image remotePatterns work in both local
// dev (http://localhost:4000) and production (your real API domain/subdomain).
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.businessdayafrica.net";
const apiHost = new URL(apiUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiHost.protocol.replace(":", "") as "http" | "https",
        hostname: apiHost.hostname,
        port: apiHost.port || undefined,
        pathname: "/uploads/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },

  // Any request to /uploads/... on this app (port 3000) gets silently
  // forwarded to the backend (port 4000 in dev). This means relative
  // "/uploads/..." paths — like the ones the Tiptap editor inserts as
  // plain <img> tags, or ones stored in article content_html — resolve
  // correctly everywhere, without needing to rewrite them to absolute
  // URLs in code or in the database.
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