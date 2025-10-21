// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  webpack: (config, { dev, isServer }) => {
    // Dev build optimizasiyaları
    if (dev) {
      config.optimization.moduleIds = "named";
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }
    // Prod client bundle optimizasiyaları
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

    // Brauzer bundleda lazım olmayan node core modulları
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Sənin domenlərin
      { protocol: "https", hostname: "jetacademy.az", pathname: "/**" },
      { protocol: "https", hostname: "www.jetacademy.az", pathname: "/**" },
      { protocol: "https", hostname: "api.jetacademy.az", pathname: "/**" },
      { protocol: "https", hostname: "api.jetschool.az", pathname: "/**" },

      // Test/keçid domenin varsa
      { protocol: "https", hostname: "api.new.jetacademy.az", pathname: "/**" },

      // (İstifadə edirsənsə) CDN hostu — öz CDN domenini yaz
      { protocol: "https", hostname: "cdn.jetacademy.az", pathname: "/**" },

      // Üçüncü tərəf
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "place-hold.it", pathname: "/**" },

      // DEV üçün localhost hostları
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/**" },
    ],
  },

  async rewrites() {
    // Prod-da /api rewrite ETMİRİK — Nginx artıq /api-ni backend-ə ötürür.
    const routes = [
      { source: "/sitemap.xml", destination: "/api/sitemap" },
    ];

    // Dev zamanı Next dev serverindən local NestJS-ə rahat proxy
    if (!isProd) {
      routes.push({
        source: "/api/:path*",
        destination: "http://127.0.0.1:3031/:path*",
      });
    }

    return routes;
  },
};

export default withNextIntl(nextConfig);
