/** @type {import('next').NextConfig} */
const repo = 'Analisis-Numerico_KeyLimePie_Teoria_de_Errores'

const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
