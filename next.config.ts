import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    pageExtensions: ["ts", "tsx"],
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },
};

export default nextConfig;
