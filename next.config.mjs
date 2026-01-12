/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow remote images from these domains
    domains: [
      "lh3.googleusercontent.com",
      "217.196.49.184",
      "via.placeholder.com",
      "80.65.208.86",
      "api.qopcrm.com",
    ],
    // Disable Next.js image optimization to avoid server-side
    // fetch errors when an upstream image returns 404
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
