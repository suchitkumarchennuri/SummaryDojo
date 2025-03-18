/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "s3.amazonaws.com"],
  },
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Minimize timeout issues
  staticPageGenerationTimeout: 180,
  productionBrowserSourceMaps: true,
  scripts: {
    build: "NODE_OPTIONS='--max-old-space-size=4096' next build",
  },
};

export default nextConfig;
