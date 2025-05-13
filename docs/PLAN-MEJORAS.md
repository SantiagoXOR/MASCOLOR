# Plan de Mejoras para el Proyecto +COLOR

Este documento detalla el plan de mejoras para el proyecto +COLOR, enfocándose en cinco áreas principales: migración de datos a Supabase, refactorización de código, optimización de imágenes, mejora de SEO e implementación de búsqueda.

## 1. Migración de datos estáticos a Supabase

### Objetivo
Migrar los datos de productos actualmente definidos como estáticos en el código a una base de datos Supabase para facilitar actualizaciones y mantenimiento.

### Esquema de base de datos
```sql
-- Tabla de categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de marcas
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2),
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  badge TEXT CHECK (badge IN ('new', 'bestseller', 'featured', 'limited')),
  icon TEXT,
  coverage DECIMAL(10, 2), -- m² por litro (para calculadora)
  coats INTEGER, -- Número de manos recomendadas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de características de productos
CREATE TABLE product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Implementación
1. Crear servicios para interactuar con Supabase (`lib/supabase/products.ts`)
2. Actualizar tipos en `types/index.ts`
3. Refactorizar hooks existentes para usar datos dinámicos (`hooks/useProducts.ts`)
4. Crear script de migración para transferir datos existentes (`scripts/migrate-to-supabase.ts`)

## 2. Refactorización para eliminar duplicación de código

### Objetivo
Eliminar la duplicación de código en la sección de productos entre las vistas por categoría y por marca.

### Implementación
1. Crear componentes reutilizables:
   - `components/ui/product-card.tsx`
   - `components/ui/product-grid.tsx`
2. Crear hook personalizado para filtros (`hooks/useProductFilters.ts`)
3. Refactorizar `components/sections/products.tsx`

## 3. Optimización de imágenes

### Objetivo
Mejorar el rendimiento y la experiencia del usuario mediante la optimización de imágenes y el uso de formatos modernos.

### Implementación
1. Actualizar script de optimización (`scripts/optimize-images-advanced.js`)
2. Mejorar componente OptimizedImage (`components/ui/optimized-image.tsx`)
   - Soporte para art direction
   - Mejor manejo de formatos modernos (WebP, AVIF)
   - Lazy loading mejorado

## 4. Mejora de SEO

### Objetivo
Mejorar el posicionamiento en buscadores mediante metadatos más específicos y un sitemap mejorado.

### Implementación
1. Crear componente de metadatos dinámicos (`components/seo/metadata.tsx`)
2. Implementar en páginas principales
3. Generar sitemap dinámico (`app/sitemap.ts`)

## 5. Implementación de búsqueda de productos

### Objetivo
Mejorar la experiencia del usuario permitiendo buscar productos rápidamente.

### Implementación
1. Crear componente de búsqueda (`components/ui/search-bar.tsx`)
2. Implementar hook para debounce (`hooks/useDebounce.ts`)
3. Crear página de resultados de búsqueda (`app/busqueda/page.tsx`)
4. Integrar en el header (`components/layout/header.tsx`)

## Orden de implementación

Para implementar estas mejoras, se seguirá este orden:

1. Configurar Supabase y crear el esquema de base de datos
2. Ejecutar el script de migración de datos
3. Implementar los servicios y hooks para interactuar con Supabase
4. Refactorizar los componentes para usar datos dinámicos
5. Implementar la optimización de imágenes
6. Mejorar el SEO con metadatos dinámicos
7. Implementar la funcionalidad de búsqueda

Cada uno de estos pasos puede implementarse de forma independiente, lo que permite un enfoque incremental para mejorar el proyecto sin interrumpir su funcionamiento actual.
