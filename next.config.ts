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

    // Cache each transformed image for 31 days instead of the 60s default.
    // Repeat requests for the same size/format hit cache instead of
    // re-transforming, which is what was burning through your quota.
    minimumCacheTTL: 2678400,

    // Only generate WebP, not AVIF+WebP. Cuts transformations per image
    // roughly in half. Drop this line entirely if you want AVIF back later.
    formats: ["image/webp"],

    // Lock quality to one value instead of letting every requested quality
    // count as a distinct transformation.
    qualities: [75],

    // Trim to the sizes you actually render. Every unique width Next.js
    // generates (from these two arrays combined) is a separate
    // transformation the first time it's requested. Adjust to match your
    // actual breakpoints/thumbnail sizes — don't just copy these blindly.
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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
