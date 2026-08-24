import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output traces only the node_modules the server actually
  // needs into .next/standalone — the Docker image copies that instead of
  // the full node_modules tree.
  output: "standalone",
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
