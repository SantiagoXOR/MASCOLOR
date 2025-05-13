# Sistema de Gestión de Activos para +COLOR

Este documento detalla el sistema de gestión de activos implementado en el proyecto +COLOR para manejar imágenes y otros recursos de manera eficiente.

## Índice

1. [Introducción](#introducción)
2. [Estructura del Sistema](#estructura-del-sistema)
3. [Estandarización de Nombres de Archivos](#estandarización-de-nombres-de-archivos)
4. [Actualización de Referencias en la Base de Datos](#actualización-de-referencias-en-la-base-de-datos)
5. [Sistema de Gestión de Activos](#sistema-de-gestión-de-activos)
6. [Procesamiento de Imágenes de Productos](#procesamiento-de-imágenes-de-productos)
7. [Scripts Disponibles](#scripts-disponibles)
8. [Mejores Prácticas](#mejores-prácticas)

## Introducción

El sistema de gestión de activos de +COLOR está diseñado para:

- Estandarizar los nombres de archivos de imágenes
- Optimizar imágenes para diferentes dispositivos y conexiones
- Mantener un catálogo centralizado de todos los activos
- Facilitar el acceso a los activos desde la aplicación
- Mejorar el rendimiento y la experiencia del usuario

## Estructura del Sistema

El sistema se compone de varios scripts y componentes:

1. **Estandarización de nombres**: Script para normalizar los nombres de archivos
2. **Actualización de referencias**: Script para actualizar las referencias en la base de datos
3. **Sistema de gestión de activos**: Núcleo del sistema que procesa y cataloga los activos
4. **Procesamiento de imágenes**: Script para procesar imágenes de productos

## Estandarización de Nombres de Archivos

El script `standardize-image-names.js` normaliza los nombres de archivos de imágenes:

- Convierte todos los nombres a minúsculas
- Reemplaza espacios por guiones
- Mantiene la extensión original
- Actualiza las referencias en la base de datos

### Uso

```bash
npm run standardize-image-names
```

### Resultado

- Todos los archivos de imágenes tendrán nombres estandarizados
- Se generará un informe de los cambios realizados en `reports/image-standardization-report.json`

## Actualización de Referencias en la Base de Datos

El script `update-database-image-references.js` actualiza las referencias de imágenes en la base de datos:

- Verifica que las rutas en la base de datos coincidan con los archivos reales
- Busca coincidencias para las rutas que no existen
- Actualiza las referencias en la base de datos

### Uso

```bash
npm run update-db-image-refs
```

### Resultado

- Las referencias de imágenes en la base de datos coincidirán con los archivos reales
- Se generará un informe de los cambios realizados en `reports/database-image-references-report.json`

## Sistema de Gestión de Activos

El script `asset-management-system.js` implementa el núcleo del sistema:

- Organiza y cataloga todos los activos
- Genera versiones optimizadas para diferentes usos
- Mantiene un registro centralizado de todos los activos
- Proporciona una API para acceder a los activos

### Características

- **Optimización de imágenes**: Genera versiones en diferentes formatos (WebP, AVIF, JPG, PNG)
- **Versiones responsive**: Crea versiones para diferentes tamaños de pantalla
- **Placeholders**: Genera miniaturas para carga progresiva
- **Catálogo centralizado**: Mantiene un registro de todos los activos
- **Integración con Supabase**: Almacena información de activos en la base de datos

### Uso

```bash
npm run init-asset-management
```

### API

El sistema proporciona una API para procesar activos:

```javascript
const assetManager = require("./scripts/asset-management-system");

// Procesar un activo
const asset = await assetManager.processAsset(
  "ruta/al/archivo.jpg",
  "categoria",
  "nombre-del-activo"
);
```

## Procesamiento de Imágenes de Productos

El script `process-product-images.js` procesa todas las imágenes de productos:

- Escanea el directorio de imágenes de productos
- Procesa cada imagen utilizando el sistema de gestión de activos
- Actualiza las referencias en la base de datos

### Uso

```bash
npm run process-product-images
```

### Resultado

- Todas las imágenes de productos serán procesadas y optimizadas
- Las referencias en la base de datos serán actualizadas
- Se generará un informe de los cambios realizados en `reports/product-images-processing-report.json`

## Búsqueda de Imágenes Faltantes

El script `find-missing-images.js` busca imágenes faltantes y actualiza las referencias en la base de datos:

- Busca productos con imágenes faltantes
- Intenta encontrar coincidencias en el directorio de imágenes
- Actualiza las referencias en la base de datos

### Uso

```bash
npm run find-missing-images
```

### Resultado

- Las referencias de imágenes faltantes serán actualizadas
- Se generará un informe de los cambios realizados en `reports/missing-images-report.json`

## Scripts Disponibles

| Script                    | Descripción                                               |
| ------------------------- | --------------------------------------------------------- |
| `standardize-image-names` | Estandariza los nombres de archivos de imágenes           |
| `update-db-image-refs`    | Actualiza las referencias de imágenes en la base de datos |
| `init-asset-management`   | Inicializa el sistema de gestión de activos               |
| `process-product-images`  | Procesa todas las imágenes de productos                   |
| `create-assets-table`     | Crea la tabla de activos en Supabase                      |
| `find-missing-images`     | Busca imágenes faltantes y actualiza las referencias      |

## Estructura de la Base de Datos

El sistema de gestión de activos utiliza una tabla en Supabase para almacenar información sobre los activos:

### Tabla `assets`

| Columna          | Tipo      | Descripción                                               |
| ---------------- | --------- | --------------------------------------------------------- |
| `id`             | TEXT      | ID único del activo (hash MD5)                            |
| `name`           | TEXT      | Nombre descriptivo del activo                             |
| `category`       | TEXT      | Categoría del activo (products, backgrounds, logos, etc.) |
| `originalFormat` | TEXT      | Formato original del activo (png, jpg, etc.)              |
| `originalWidth`  | INTEGER   | Ancho original del activo en píxeles                      |
| `originalHeight` | INTEGER   | Alto original del activo en píxeles                       |
| `originalSize`   | INTEGER   | Tamaño original del activo en bytes                       |
| `dateAdded`      | TIMESTAMP | Fecha y hora en que se añadió el activo                   |
| `versions`       | JSONB     | Versiones del activo en diferentes formatos y tamaños     |
| `metadata`       | JSONB     | Metadatos adicionales del activo                          |

### Relación con la tabla `products`

La tabla `products` tiene una columna `asset_id` que hace referencia a la tabla `assets`, lo que permite asociar cada producto con su activo correspondiente.

## Mejores Prácticas

1. **Estandarizar nombres de archivos**: Utiliza nombres en minúsculas, sin espacios y con guiones para separar palabras.

2. **Optimizar imágenes**: Utiliza el sistema de gestión de activos para optimizar todas las imágenes.

3. **Utilizar el componente OptimizedImage**: Usa el componente `OptimizedImage` en lugar del componente `Image` estándar de Next.js.

4. **Proporcionar dimensiones precisas**: Especifica el ancho y alto de las imágenes para evitar el desplazamiento de contenido durante la carga.

5. **Utilizar el atributo `sizes`**: Indica el tamaño de la imagen en diferentes breakpoints.

6. **Priorizar imágenes críticas**: Utiliza el atributo `priority` para las imágenes que aparecen en el viewport inicial.

7. **Actualizar el catálogo regularmente**: Ejecuta los scripts de procesamiento cuando se añadan nuevas imágenes.

8. **Revisar los informes**: Verifica los informes generados para detectar posibles problemas.

## Ejemplo de Uso del Componente OptimizedImage

```tsx
import { OptimizedImage } from "@/components/ui/optimized-image";

// Uso básico
<OptimizedImage
  src="/assets/images/products/[asset-id]/original.webp"
  alt="Descripción de la imagen"
  width={500}
  height={300}
/>

// Uso avanzado
<OptimizedImage
  src="/assets/images/products/[asset-id]/original.webp"
  alt="Descripción de la imagen"
  fallbackSrc="/images/products/placeholder.jpg"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={true}
  usePlaceholder={true}
  useBlur={true}
  artDirectionSources={[
    {
      media: "(max-width: 640px)",
      srcSet: "/assets/images/products/[asset-id]/640.webp"
    },
    {
      media: "(max-width: 1024px)",
      srcSet: "/assets/images/products/[asset-id]/1024.webp"
    }
  ]}
/>
```

## Conclusión

El sistema de gestión de activos de +COLOR proporciona una solución completa para manejar imágenes y otros recursos de manera eficiente. Siguiendo las mejores prácticas y utilizando los scripts y componentes proporcionados, se puede mejorar significativamente el rendimiento y la experiencia del usuario.
