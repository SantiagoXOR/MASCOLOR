/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Configuración de rutas y salida
  output: "standalone",
  trailingSlash: false,
  // Asegurarse de que los archivos estáticos se copien
  distDir: ".next",
  assetPrefix: "",
  // Configuración de logging para depuración
  logging: {
    level: "info",
    fetches: {
      fullUrl: true,
    },
  },
  // Configuración para resolver problemas con framer-motion
  transpilePackages: ["framer-motion"],
  // Configuración adicional
  // Nota: Se han eliminado las opciones no reconocidas
};

export default nextConfig;
