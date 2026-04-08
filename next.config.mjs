/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.puter.com' },
      { protocol: 'https', hostname: '*.github.dev' },
      { protocol: 'https', hostname: '*.vercel.app' },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevents Fabric.js from trying to use node-canvas in the browser/Vercel
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
