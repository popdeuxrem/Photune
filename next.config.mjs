/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.puter.com' },
      { protocol: 'https', hostname: '*.github.dev' },
    ],
  },
  // Fabric 6+ is purely ESM. We transpile it to ensure compatibility.
  transpilePackages: ['fabric'],
  webpack: (config, { isServer }) => {
    // Newer Fabric versions still reference the 'canvas' module for node environments.
    // We null it out for browser builds and Vercel deployments.
    if (!isServer) {
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
