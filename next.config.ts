import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    }
  },
  // Allow images from all origins to be optimized for demo purpose only
  images: {
    localPatterns: [
      {
        pathname: '/**',
      }
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      }
    ]
  },
  compiler: {
    styledComponents: true,
  }
};

export default nextConfig;
