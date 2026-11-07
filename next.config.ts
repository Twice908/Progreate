import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: lets phones on the same Wi-Fi load the dev server over its LAN address.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*", "*.local"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
