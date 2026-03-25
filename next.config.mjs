/** @type {import('next').NextConfig} */
const backend = process.env.NEXT_PUBLIC_API_URL;

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

  async rewrites() {
    const backendInternalUrl = "http://172.16.32.199:3303";

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendInternalUrl}/uploads/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
