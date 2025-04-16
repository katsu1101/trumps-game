import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/trumps-game',
  assetPrefix: '/trumps-game/',
  images: {
    unoptimized: true, // next/image を使っても export に対応させる
  },
};

export default nextConfig;
