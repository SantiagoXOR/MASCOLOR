/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Exponer variables de entorno
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Configuración de imágenes optimizada
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hffupqoqbjhehedtemvl.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    // Priorizar WebP sobre AVIF para mejor compatibilidad y rendimiento
    formats: ["image/webp", "image/avif"],
    // Reducir la cantidad de tamaños para mejorar la caché
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    // Aumentar el tiempo de caché para mejorar rendimiento
    minimumCacheTTL: 3600, // 1 hora
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimizaciones de rendimiento
  experimental: {
    // Habilitar optimizaciones experimentales
    optimizeCss: true, // Optimizar CSS
    scrollRestoration: true, // Restaurar posición de scroll
    optimizePackageImports: ["framer-motion", "lucide-react"], // Optimizar importaciones
  },

  // Configuración de webpack optimizada
  webpack: (config, { isServer }) => {
    // Configuración específica para el cliente
    if (!isServer) {
      // Evitar que el cliente intente importar módulos de servidor
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    // Optimizar tamaño del bundle
    config.optimization.minimize = true;

    return config;
  },

  // Optimizaciones de producción
  productionBrowserSourceMaps: false, // Deshabilitar source maps en producción
  swcMinify: true, // Usar SWC para minificación
  poweredByHeader: false, // Eliminar header X-Powered-By
};

module.exports = nextConfig;
