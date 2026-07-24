import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images : {
    remotePatterns:[
      {
        hostname: "static.vecteezy.com"
      },
      {
        hostname: "example.com"
      }
    ]
  }
};

export default nextConfig;
