import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development', // Bypass private IP restriction in dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.hometexbd.ltd",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "123.176.58.209",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default withNextIntl(nextConfig);

