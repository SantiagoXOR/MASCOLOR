# Implementación de Supabase en +COLOR

Este documento detalla la implementación de Supabase como base de datos para el proyecto +COLOR, reemplazando los datos estáticos por una solución dinámica y escalable.

## Configuración inicial

### 1. Creación del proyecto en Supabase

Se creó un nuevo proyecto en Supabase con las siguientes características:
- **Nombre**: mascolor
- **Región**: sa-east-1 (Sudamérica)
- **Plan**: Free
- **ID del proyecto**: hffupqoqbjhehedtemvl

### 2. Configuración de variables de entorno

Se configuraron las siguientes variables de entorno en el archivo `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hffupqoqbjhehedtemvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Esquema de base de datos

Se crearon las siguientes tablas en Supabase:

### Tabla `categories`

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `brands`

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `products`

```sql
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
  coverage DECIMAL(10, 2),
  coats INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `product_features`

```sql
CREATE TABLE product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Migración de datos

Se creó un script de migración (`scripts/migrate-to-supabase.js`) para transferir los datos estáticos a Supabase. El script realiza las siguientes acciones:

1. Inserta categorías predefinidas
2. Inserta marcas predefinidas
3. Obtiene los IDs de categorías y marcas
4. Prepara los productos con las referencias correctas
5. Inserta los productos en la base de datos

Para ejecutar la migración:

```bash
npm run migrate-to-supabase
```

## Servicios y hooks implementados

### Servicios de Supabase

Se creó un servicio para interactuar con la base de datos en `lib/supabase/products.ts` con las siguientes funciones:

- `getCategories()`: Obtiene todas las categorías
- `getBrands()`: Obtiene todas las marcas
- `getProducts()`: Obtiene productos con filtros opcionales
- `getProductBySlug()`: Obtiene un producto específico por su slug
- `getFeaturedProducts()`: Obtiene productos destacados
- `getBestsellerProducts()`: Obtiene productos más vendidos
- `getNewProducts()`: Obtiene productos nuevos

### Hooks personalizados

Se actualizaron y crearon los siguientes hooks para trabajar con los datos dinámicos:

- `useProducts.ts`: Obtiene productos con filtros opcionales
- `useCategories.ts`: Obtiene categorías de productos
- `useBrands.ts`: Obtiene marcas de productos
- `useProductFilters.ts`: Gestiona filtros de productos (categoría, marca, búsqueda)

## Tipos actualizados

Se actualizaron los tipos en `types/index.ts` para reflejar la nueva estructura de datos:

```typescript
// Tipos para productos
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  image_url: string;
  category_id?: string;
  category?: Category;
  brand_id?: string;
  brand?: Brand;
  badge?: "new" | "bestseller" | "featured" | "limited";
  icon?: string;
  coverage?: number; // m² por litro
  coats?: number; // Número de manos recomendadas
  features?: ProductFeature[];
}

// Tipos para categorías
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
}

// Tipos para marcas
export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
}

// Tipos para características de productos
export interface ProductFeature {
  id: string;
  name: string;
  value: string;
}
```

## Próximos pasos

1. Refactorizar los componentes para usar los datos dinámicos de Supabase
2. Implementar la optimización de imágenes
3. Mejorar el SEO con metadatos dinámicos
4. Implementar la funcionalidad de búsqueda
