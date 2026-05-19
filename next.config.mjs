/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote images from these domains
    domains: [
      "lh3.googleusercontent.com",
      "via.placeholder.com",
      "api.qopcrm.com",
      "api.staging.qopcrm.com",
    ],
    // Disable Next.js image optimization to avoid server-side
    // fetch errors when an upstream image returns 404
    unoptimized: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; frame-ancestors 'none'; img-src 'self' https://api.staging.qopcrm.com https://api.qopcrm.com data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.staging.qopcrm.com https://api.qopcrm.com wss://api.staging.qopcrm.com wss://api.qopcrm.com;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
