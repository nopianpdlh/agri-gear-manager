import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hdimlfdjnilmwrwcyujd.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/equipment-photos/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storyset.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
