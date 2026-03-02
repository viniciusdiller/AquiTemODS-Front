/** @type {import('next').NextConfig} */
const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.16.32.199",
        port: "3303",
        pathname: "/uploads/**",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["http://172.16.32.199:3000"],
  },

  async rewrites() {
    const base = backend.replace(/\/$/, "");
    return [
      {
        source: "/uploads/:path*",
        destination: `${base}/uploads/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
      // NOTA: não proxyar rotas de frontend como /admin ou /sustentai,
      // pois assim o Next não consegue renderizá-las localmente.
    ];
  },
};

export default nextConfig;
