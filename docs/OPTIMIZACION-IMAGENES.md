# Optimización de Imágenes en +COLOR

Este documento detalla las mejoras implementadas para la optimización de imágenes en el proyecto +COLOR.

## Script de Optimización Avanzado

Se ha mejorado el script `optimize-images-advanced.js` para proporcionar una optimización más completa de las imágenes:

```javascript
// scripts/optimize-images-advanced.js
/**
 * Script avanzado para optimizar imágenes en el proyecto +COLOR
 * 
 * Este script:
 * 1. Optimiza todas las imágenes en el directorio public/images
 * 2. Prioriza formatos WebP y AVIF para mejor rendimiento
 * 3. Crea versiones responsive para diferentes tamaños de pantalla
 * 4. Genera placeholders de baja resolución para carga progresiva
 */
```

### Características principales:

1. **Soporte para formatos modernos**:
   - Genera automáticamente versiones WebP y AVIF de cada imagen
   - Ajusta la calidad de compresión según el formato para un balance óptimo

2. **Versiones responsive**:
   - Crea versiones redimensionadas para diferentes tamaños de pantalla (640px, 768px, 1024px, 1280px, 1536px)
   - Genera cada versión responsive en todos los formatos soportados

3. **Placeholders para carga progresiva**:
   - Genera imágenes de baja resolución (20x20px) con efecto de desenfoque
   - Crea placeholders en todos los formatos soportados

4. **Estructura de directorios organizada**:
   - Mantiene la estructura de directorios original
   - Almacena las versiones optimizadas en un directorio separado
   - Organiza las versiones responsive en subdirectorios

### Uso del script:

```bash
npm run optimize-images
```

## Componente OptimizedImage Mejorado

Se ha mejorado el componente `OptimizedImage` para aprovechar las imágenes optimizadas:

```typescript
// components/ui/optimized-image.tsx
/**
 * Componente OptimizedImage mejorado que extiende el componente Image de Next.js
 * con características adicionales como:
 * - Carga progresiva con placeholders
 * - Soporte para formatos modernos (WebP, AVIF)
 * - Manejo de errores con imagen de respaldo
 * - Efectos de transición personalizables
 * - Art direction para diferentes dispositivos
 */
```

### Características principales:

1. **Carga progresiva**:
   - Muestra un placeholder de baja resolución mientras se carga la imagen completa
   - Transición suave entre el placeholder y la imagen final

2. **Soporte para formatos modernos**:
   - Utiliza el elemento `<picture>` para proporcionar diferentes formatos según el soporte del navegador
   - Prioriza AVIF y WebP sobre formatos tradicionales

3. **Art direction**:
   - Permite especificar diferentes imágenes para diferentes tamaños de pantalla
   - Útil para mostrar versiones recortadas o con diferente composición según el dispositivo

4. **Manejo de errores**:
   - Soporte para imágenes de respaldo en caso de error
   - Indicadores visuales cuando una imagen no se puede cargar

5. **Personalización**:
   - Estilos personalizables para el contenedor, la imagen y el indicador de carga
   - Opciones para habilitar/deshabilitar características específicas

### Ejemplo de uso:

```tsx
<OptimizedImage
  src="/images/products/product-1.jpg"
  fallbackSrc="/images/placeholder.jpg"
  placeholderSrc="/images/products/product-1-placeholder.jpg"
  alt="Producto 1"
  width={500}
  height={500}
  artDirectionSources={[
    {
      media: "(max-width: 640px)",
      srcSet: "/images/products/responsive/product-1-640.jpg"
    },
    {
      media: "(max-width: 1024px)",
      srcSet: "/images/products/responsive/product-1-1024.jpg"
    }
  ]}
/>
```

## Beneficios de la Optimización

1. **Mejor rendimiento**:
   - Reducción significativa del tamaño de las imágenes (hasta un 70% con AVIF)
   - Carga más rápida de la página, especialmente en conexiones lentas

2. **Mejor experiencia de usuario**:
   - Carga progresiva para mostrar contenido visual rápidamente
   - Transiciones suaves entre placeholders e imágenes finales

3. **Mejor SEO**:
   - Mejora en las métricas Core Web Vitals (LCP, CLS)
   - Mayor puntuación en herramientas como Lighthouse y PageSpeed Insights

4. **Compatibilidad con dispositivos**:
   - Imágenes optimizadas para diferentes tamaños de pantalla
   - Soporte para navegadores modernos y antiguos

## Próximos Pasos

1. Implementar la carga diferida (lazy loading) para imágenes fuera de la vista inicial
2. Mejorar el SEO con metadatos dinámicos
3. Implementar la funcionalidad de búsqueda
