import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/claudemd-generator",
  images: {
    unoptimized: true,
  },
  // Disable anonymous telemetry collection
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
