// next.config.mjs
/** @type {import('next').NextConfig} */

// ⚠️ nombre EXACTO del repositorio en GitHub
const repo = 'Analisis-Numerico_KeyLimePie_Teoria_de_Errores'

const nextConfig = {
  // Requerido para GitHub Pages (genera HTML estático en /out)
  output: 'export',

  // Necesario para que rutas y assets funcionen bajo /<repo>/
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,

  // Mejor compatibilidad en GH Pages
  trailingSlash: true,

  // Evita optimización de imágenes (no disponible en export estático)
  images: { unoptimized: true },

  // Mantengo tus flags de build relajados
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
