import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // product photos served from the supabase product-images bucket
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
