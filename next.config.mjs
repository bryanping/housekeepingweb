/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(Array.isArray(config.externals) ? config.externals : []), '@opentelemetry/api']
    } else {
      config.resolve.fallback = { ...config.resolve.fallback, '@opentelemetry/api': false }
    }
    return config
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },
}
export default nextConfig
