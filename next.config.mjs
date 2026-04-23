/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'portal.way4tech.com' },
    ],
  },
  experimental: {
    // Needed for @cloudflare/next-on-pages edge runtime
  },
};

export default nextConfig;
