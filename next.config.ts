import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    }
  }
};

export default nextConfig;
