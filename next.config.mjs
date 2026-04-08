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
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Prevents Fabric.js from trying to use node-canvas in the browser/Vercel
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    // Suppress webpack cache warning for large strings (Tesseract.js worker, etc.)
    // This is a dev-only optimization warning, not a runtime error
    if (dev && config.cache) {
      config.cache = {
        ...config.cache,
        type: 'filesystem',
        compression: 'gzip',
        maxMemoryGenerations: 1,
      };
    }

    // Optimize chunking to reduce large string serialization
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            tesseract: {
              test: /[\\/]node_modules[\\/]tesseract\.js/,
              name: 'tesseract',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
