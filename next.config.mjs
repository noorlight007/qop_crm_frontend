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
};

export default nextConfig;
