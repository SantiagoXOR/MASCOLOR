# Guía de Buenas Prácticas de Rendimiento para +COLOR

Esta guía proporciona recomendaciones para mantener y mejorar el rendimiento de la aplicación +COLOR durante el desarrollo continuo.

## Índice
1. [Imágenes](#1-imágenes)
2. [Componentes](#2-componentes)
3. [Animaciones](#3-animaciones)
4. [Estado y Datos](#4-estado-y-datos)
5. [Herramientas de Monitoreo](#5-herramientas-de-monitoreo)

## 1. Imágenes

### Optimización de imágenes
- **Utilizar siempre el componente `OptimizedImage`** en lugar de `Image` de Next.js
- **Ejecutar regularmente el script de optimización**:
  ```bash
  npm run optimize-images-advanced
  ```
- **Priorizar formatos modernos** en este orden:
  1. WebP (mejor equilibrio entre compatibilidad y compresión)
  2. AVIF (mejor compresión pero menor compatibilidad)
  3. JPG (como fallback)

### Dimensiones y tamaños
- **Especificar siempre el atributo `sizes`** para diferentes breakpoints:
  ```tsx
  <OptimizedImage
    src="/images/product.jpg"
    alt="Producto"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  ```
- **Utilizar el atributo `priority` solo para imágenes críticas** (above the fold):
  ```tsx
  <OptimizedImage
    src="/images/hero.jpg"
    alt="Hero"
    priority
  />
  ```

## 2. Componentes

### Carga perezosa (Lazy Loading)
- **Utilizar `dynamic import` para componentes pesados**:
  ```tsx
  import dynamic from 'next/dynamic';
  
  const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
    loading: () => <p>Cargando...</p>,
    ssr: false // Deshabilitar SSR si el componente no es necesario para el SEO
  });
  ```

### Memoización
- **Utilizar `useMemo` para cálculos costosos**:
  ```tsx
  const expensiveCalculation = useMemo(() => {
    return someComplexCalculation(props.data);
  }, [props.data]);
  ```
- **Utilizar `useCallback` para funciones que se pasan como props**:
  ```tsx
  const handleClick = useCallback(() => {
    // Lógica del evento
  }, [dependencias]);
  ```

### Renderizado condicional
- **Implementar detección de dispositivos de bajo rendimiento**:
  ```tsx
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);
  
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isLowCPU = navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    setIsLowPerformanceDevice(isMobile || isLowCPU || Boolean(isLowMemory));
  }, []);
  
  return isLowPerformanceDevice ? <LightComponent /> : <FullComponent />;
  ```

## 3. Animaciones

### Optimización de Framer Motion
- **Utilizar `layoutId` para transiciones entre estados** en lugar de animaciones complejas
- **Evitar animaciones en listas largas**:
  ```tsx
  // En lugar de esto
  {items.map(item => (
    <motion.div animate={{ opacity: 1 }}>
      {item}
    </motion.div>
  ))}
  
  // Hacer esto
  <motion.div animate={{ opacity: 1 }}>
    {items.map(item => (
      <div>{item}</div>
    ))}
  </motion.div>
  ```
- **Desactivar animaciones en dispositivos de bajo rendimiento**:
  ```tsx
  {isLowPerformanceDevice ? (
    <div>{children}</div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  )}
  ```

### CSS vs. JavaScript
- **Preferir animaciones CSS para transiciones simples**:
  ```css
  .card {
    transition: transform 0.3s ease;
  }
  .card:hover {
    transform: translateY(-5px);
  }
  ```
- **Utilizar `will-change` con moderación** para optimizar animaciones complejas:
  ```css
  .animated-element {
    will-change: transform, opacity;
  }
  ```

## 4. Estado y Datos

### Gestión de estado
- **Utilizar React Query o SWR para datos remotos**:
  ```tsx
  const { data, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchProducts(category),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
  ```
- **Implementar debounce para inputs de búsqueda**:
  ```tsx
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchProducts(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  ```

### Optimización de API
- **Implementar paginación para listas largas**:
  ```tsx
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 0 }) => fetchProducts({ offset: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });
  ```
- **Utilizar caché HTTP adecuadamente**:
  ```tsx
  // En el servidor
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  ```

## 5. Herramientas de Monitoreo

### Análisis de rendimiento
- **Ejecutar Lighthouse regularmente** para detectar problemas de rendimiento
- **Monitorear Web Vitals** en producción:
  ```tsx
  export function reportWebVitals(metric) {
    console.log(metric);
    // Enviar a un servicio de análisis
  }
  ```

### Análisis de bundle
- **Utilizar `@next/bundle-analyzer` para analizar el tamaño del bundle**:
  ```js
  // next.config.js
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
  module.exports = withBundleAnalyzer({
    // Configuración de Next.js
  });
  ```
  
- **Ejecutar el análisis de bundle antes de cada release importante**:
  ```bash
  ANALYZE=true npm run build
  ```

### Pruebas de rendimiento
- **Implementar pruebas de rendimiento automatizadas** con herramientas como Lighthouse CI
- **Simular dispositivos de gama baja** durante las pruebas utilizando las herramientas de desarrollo del navegador

---

Siguiendo estas recomendaciones, el equipo de desarrollo podrá mantener y mejorar el rendimiento de la aplicación +COLOR a medida que evoluciona con nuevas características y contenido.
