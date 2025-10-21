import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  /* config options here */
  output: "standalone",
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Development optimizations
    if (dev) {
      // Enable fast refresh
      config.optimization.moduleIds = "named";

      // Optimize development builds
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Optimize module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "place-hold.it",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.jetschool.az",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.jetacademy.az",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "api.jetacademy.az",
        port: "",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "api.new.jetacademy.az",
        port: "",
        pathname: "/**",
      },
       {
        protocol: "http",
        hostname: "api.new.jetacademy.az",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
