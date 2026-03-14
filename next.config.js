/** @type {import('next').NextConfig} */
const nextConfig = {
  // আপনার ইমেজের কনফিগারেশন এখানে থাকল
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  
  // এই অংশটুকু এরর ইগনোর করবে
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
