/** @type {import('next').NextConfig} */
const repo = 'KeyLimePie_Errores'

const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
