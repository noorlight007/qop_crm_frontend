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
              "default-src 'self'; img-src 'self' https://api.staging.qopcrm.com https://api.qopcrm.com data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.staging.qopcrm.com https://api.qopcrm.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
