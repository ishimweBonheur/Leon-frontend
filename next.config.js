/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Required for deployment on platforms like Render
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

module.exports = nextConfig;
