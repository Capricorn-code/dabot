import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // メモリ使用量を削減
    webpackMemoryOptimizations: true,
  },
  // 本番ビルドの最適化
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
