# Optimización de Rendimiento para +COLOR

Este documento detalla las optimizaciones implementadas para mejorar el rendimiento de la aplicación +COLOR, especialmente en dispositivos móviles o de bajo rendimiento.

## Índice
1. [Optimización de componentes de depuración](#1-optimización-de-componentes-de-depuración)
2. [Optimización de carga de imágenes](#2-optimización-de-carga-de-imágenes)
3. [Optimización de animaciones](#3-optimización-de-animaciones)
4. [Optimización de la configuración de Next.js](#4-optimización-de-la-configuración-de-nextjs)
5. [Detección de dispositivos de bajo rendimiento](#5-detección-de-dispositivos-de-bajo-rendimiento)
6. [Recomendaciones adicionales](#6-recomendaciones-adicionales)

## 1. Optimización de componentes de depuración

### Problema identificado
Los componentes de depuración se cargaban automáticamente en entornos de desarrollo, incluso cuando no se utilizaban, lo que afectaba el rendimiento durante el desarrollo.

### Solución implementada
- Eliminamos la carga automática de componentes de depuración en el layout principal
- Ahora solo se cargan cuando se activan explícitamente mediante el DebugPanel
- Código optimizado en `app/layout-with-components.tsx`:

```tsx
{/* Componentes de depuración - controlados por el DebugContext */}
{process.env.NODE_ENV !== "production" && (
  <>
    <DebugPanel />
    {/* Cargar componentes de depuración solo cuando se activan explícitamente */}
    {/* Esto evita la carga innecesaria de componentes pesados */}
  </>
)}
```

## 2. Optimización de carga de imágenes

### Problema identificado
El componente OptimizedImage realizaba múltiples intentos de carga con diferentes formatos, generando muchas solicitudes de red y consumiendo recursos innecesariamente.

### Soluciones implementadas

#### 2.1 Optimización del componente OptimizedImage
- Reducción de la cantidad de intentos de carga de diferentes formatos de imagen
- Limitación del logging solo al entorno de desarrollo
- Disminución del tiempo de espera para la carga de imágenes de 3s a 2s
- Reducción del número máximo de intentos de 6 a 3

```tsx
// Función optimizada para intentar con el siguiente formato
const tryNextFormat = (currentAttempt: number) => {
  // Priorizar WebP y JPG que son los formatos más compatibles y eficientes
  if (currentAttempt === 0 && isAssetPath) {
    // Si es una ruta de asset, intentar directamente con WebP
    if (process.env.NODE_ENV === "development") {
      logImageDebug("Intentando con formato WebP", { src: webpSrc });
    }
    tryLoadImage(webpSrc, 1);
  } else if (currentAttempt === 1) {
    // Segundo intento, probar con JPG (saltamos AVIF para reducir intentos)
    if (process.env.NODE_ENV === "development") {
      logImageDebug("Intentando con formato JPG", { src: jpgSrc });
    }
    tryLoadImage(jpgSrc, 2);
  } else if (currentAttempt === 2 && isAssetPath) {
    // Tercer intento para assets, probar con placeholder
    // ...
  } else {
    useDefaultFallback();
  }
};
```

#### 2.2 Optimización de la carga de imágenes en ProductCard
- Reducción de la cantidad de formatos alternativos a probar
- Priorización de WebP y JPG como formatos principales
- Limitación del logging solo al entorno de desarrollo

```tsx
// Reducir la cantidad de formatos alternativos para mejorar rendimiento
// Solo usar JPG como alternativa principal y placeholder como último recurso
alternativeFormats.push(
  `/assets/images/products/${product.asset_id}/original.jpg`,
  `/assets/images/products/${product.asset_id}/placeholder.webp`
);
```

## 3. Optimización de animaciones

### Problema identificado
Las animaciones de Framer Motion pueden consumir recursos significativos, especialmente en dispositivos móviles o de bajo rendimiento.

### Soluciones implementadas

#### 3.1 Optimización de animaciones en el layout principal
- Implementación de detección de dispositivos de bajo rendimiento
- Desactivación de animaciones en dispositivos móviles o de bajo rendimiento
- Mantenimiento de animaciones solo en dispositivos de alto rendimiento

```tsx
{isLowPerformanceDevice ? (
  // Versión sin animaciones para dispositivos de bajo rendimiento
  <main id="main-content">{children}</main>
) : (
  // Versión con animaciones para dispositivos de alto rendimiento
  <AnimatePresence mode="wait">
    <motion.main
      id="main-content"
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
  </AnimatePresence>
)}
```

#### 3.2 Optimización del componente ProductGrid
- Implementación de una versión sin animaciones para dispositivos de bajo rendimiento
- Mantenimiento de animaciones solo en dispositivos de alto rendimiento

#### 3.3 Optimización del componente ProductCard
- Creación de una versión sin animaciones para dispositivos de bajo rendimiento
- Simplificación de la lógica de carga de imágenes

## 4. Optimización de la configuración de Next.js

### Problema identificado
La configuración de Next.js no estaba optimizada para el rendimiento, especialmente en lo relacionado con imágenes y optimizaciones de producción.

### Solución implementada
Actualización del archivo `next.config.js` con las siguientes mejoras:

```js
// Configuración de imágenes optimizada
images: {
  // Priorizar WebP sobre AVIF para mejor compatibilidad y rendimiento
  formats: ["image/webp", "image/avif"],
  // Reducir la cantidad de tamaños para mejorar la caché
  deviceSizes: [640, 750, 1080, 1920],
  imageSizes: [16, 32, 64, 128, 256],
  // Aumentar el tiempo de caché para mejorar rendimiento
  minimumCacheTTL: 3600, // 1 hora
},

// Optimizaciones de rendimiento
experimental: {
  // Habilitar optimizaciones experimentales
  optimizeCss: true, // Optimizar CSS
  scrollRestoration: true, // Restaurar posición de scroll
  optimizePackageImports: ["framer-motion", "lucide-react"], // Optimizar importaciones
},

// Optimizaciones de producción
productionBrowserSourceMaps: false, // Deshabilitar source maps en producción
swcMinify: true, // Usar SWC para minificación
poweredByHeader: false, // Eliminar header X-Powered-By
```

## 5. Detección de dispositivos de bajo rendimiento

Se implementó una función común para detectar dispositivos de bajo rendimiento en varios componentes:

```tsx
// Detectar si es un dispositivo móvil o de bajo rendimiento
const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

useEffect(() => {
  // Detectar dispositivos móviles o de bajo rendimiento
  const isMobile = window.innerWidth < 768;
  const isLowCPU = navigator.hardwareConcurrency <= 4;
  const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  
  setIsLowPerformanceDevice(isMobile || isLowCPU || Boolean(isLowMemory));
}, []);
```

Esta detección permite ofrecer una experiencia más ligera a los usuarios que lo necesitan, mientras se mantiene la experiencia completa con animaciones para los usuarios con dispositivos más potentes.

## 6. Recomendaciones adicionales

Para seguir mejorando el rendimiento de la aplicación, se recomienda:

1. **Implementar lazy loading para componentes pesados**:
   ```tsx
   const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
     loading: () => <p>Cargando...</p>,
     ssr: false
   });
   ```

2. **Optimizar las fuentes web**:
   - Utilizar `next/font` para optimizar la carga de fuentes
   - Considerar el uso de subconjuntos de fuentes (subsets)

3. **Implementar una estrategia de caché más agresiva**:
   - Utilizar SWR o React Query con tiempos de caché más largos
   - Implementar un service worker para cachear recursos estáticos

4. **Monitorear el rendimiento en producción**:
   - Implementar herramientas como Sentry o New Relic
   - Analizar métricas de Web Vitals regularmente
