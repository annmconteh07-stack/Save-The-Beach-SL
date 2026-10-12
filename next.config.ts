import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "80mb",
    },
  },
  async redirects() {
    return [
      { source: "/admin/media", destination: "/media-admin", permanent: false },
      { source: "/admin/login", destination: "/volunteer-admin/login", permanent: false },
      { source: "/admin", destination: "/volunteer-admin", permanent: false },
      { source: "/admin/:path*", destination: "/volunteer-admin/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
