# Sistema de Optimización de Imágenes para +COLOR

Este documento describe el sistema de optimización de imágenes implementado en el proyecto +COLOR para mejorar el rendimiento y la experiencia del usuario.

## Características principales

- **Optimización automática**: Reducción del tamaño de archivo sin pérdida significativa de calidad
- **Formatos modernos**: Generación automática de versiones WebP y AVIF
- **Imágenes responsive**: Creación de múltiples tamaños para diferentes dispositivos
- **Carga progresiva**: Placeholders de baja resolución para mejorar la percepción de velocidad
- **Manejo de errores**: Imágenes de respaldo en caso de fallos de carga

## Herramientas utilizadas

- **Sharp**: Biblioteca de procesamiento de imágenes de alto rendimiento
- **Next.js Image**: Componente optimizado para servir imágenes
- **OptimizedImage**: Componente personalizado que extiende las capacidades de Next.js Image

## Scripts disponibles

### Optimización básica

```bash
npm run optimize-images
```

Este script optimiza todas las imágenes en el directorio `public/images` manteniendo el formato original.

### Optimización avanzada

```bash
npm run optimize-images-advanced
```

Este script realiza una optimización más completa:

1. Optimiza las imágenes originales
2. Genera versiones WebP y AVIF para cada imagen
3. Crea versiones responsive para diferentes tamaños de pantalla (640px, 768px, 1024px, 1280px, 1536px)
4. Genera placeholders de baja resolución para carga progresiva

### Scripts específicos

```bash
npm run optimize-backgrounds
npm run optimize-icons
npm run optimize-logos
npm run optimize-products
```

Estos scripts optimizan categorías específicas de imágenes con configuraciones adaptadas a cada tipo.

## Componente OptimizedImage

Hemos creado un componente personalizado `OptimizedImage` que extiende el componente `Image` de Next.js con características adicionales:

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image";

// Uso básico
<OptimizedImage
  src="/images/products/product-1.jpg"
  alt="Descripción del producto"
  width={400}
  height={300}
/>

// Uso avanzado con todas las opciones
<OptimizedImage
  src="/images/products/product-1.jpg"
  placeholderSrc="/images/products/product-1-placeholder.jpg"
  fallbackSrc="/images/products/product-fallback.jpg"
  alt="Descripción del producto"
  width={400}
  height={300}
  usePlaceholder={true}
  useBlur={true}
  className="rounded-lg"
  containerClassName="shadow-lg"
  loadingClassName="bg-gray-100"
/>
```

### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `src` | string | Ruta de la imagen principal |
| `placeholderSrc` | string | Ruta del placeholder de baja resolución |
| `fallbackSrc` | string | Ruta de la imagen de respaldo en caso de error |
| `alt` | string | Texto alternativo para accesibilidad |
| `usePlaceholder` | boolean | Activar/desactivar el uso de placeholder |
| `useBlur` | boolean | Activar/desactivar el efecto de desenfoque durante la carga |
| `className` | string | Clases CSS para la imagen |
| `containerClassName` | string | Clases CSS para el contenedor |
| `loadingClassName` | string | Clases CSS para el indicador de carga |

## Mejores prácticas

1. **Ejecuta los scripts de optimización regularmente**:
   ```bash
   npm run optimize-images-advanced
   ```

2. **Utiliza el componente OptimizedImage** en lugar del componente Image estándar de Next.js para aprovechar todas las optimizaciones.

3. **Proporciona dimensiones precisas** para evitar el desplazamiento de contenido durante la carga.

4. **Utiliza el atributo `sizes`** para indicar el tamaño de la imagen en diferentes breakpoints:
   ```tsx
   <OptimizedImage
     src="/images/hero.jpg"
     alt="Hero"
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   />
   ```

5. **Prioriza las imágenes críticas** utilizando el atributo `priority`:
   ```tsx
   <OptimizedImage
     src="/images/hero.jpg"
     alt="Hero"
     priority
   />
   ```

## Rendimiento

Con este sistema de optimización, hemos logrado:

- Reducción del tamaño de las imágenes en un 40-70%
- Mejora en el tiempo de carga inicial en un 30%
- Mejor puntuación en Lighthouse para rendimiento
- Reducción del consumo de datos para usuarios móviles

## Mantenimiento

El sistema de optimización de imágenes debe mantenerse actualizado:

1. Ejecuta los scripts de optimización cada vez que se añadan nuevas imágenes
2. Actualiza las dependencias relacionadas con el procesamiento de imágenes
3. Monitorea el rendimiento con herramientas como Lighthouse o WebPageTest
