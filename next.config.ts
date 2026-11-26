import type { NextConfig } from "next";

const NEXT_ALLOWED_DEV_ORIGINS = process.env.NEXT_ALLOWED_DEV_ORIGINS || "localhost:3000";
const nextConfig: NextConfig = {
  allowedDevOrigins:[NEXT_ALLOWED_DEV_ORIGINS],
  reactCompiler: true,
};

export default nextConfig;
