# Optimización de la Base de Datos en +COLOR

Este documento describe las optimizaciones implementadas en la base de datos Supabase para mejorar el rendimiento del proyecto +COLOR.

## Índice

1. [Optimizaciones Implementadas](#optimizaciones-implementadas)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Índices](#índices)
4. [Vistas Materializadas](#vistas-materializadas)
5. [Políticas de Seguridad (RLS)](#políticas-de-seguridad-rls)
6. [Funciones de Búsqueda Optimizadas](#funciones-de-búsqueda-optimizadas)
7. [Caché del Lado del Cliente](#caché-del-lado-del-cliente)
8. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
9. [Recomendaciones Adicionales](#recomendaciones-adicionales)

## Optimizaciones Implementadas

Se han implementado las siguientes optimizaciones para mejorar el rendimiento de la base de datos:

1. **Creación de índices** para mejorar la velocidad de las consultas más frecuentes
2. **Columnas de búsqueda vectorial** para optimizar búsquedas de texto
3. **Vistas materializadas** para consultas complejas frecuentes
4. **Políticas RLS** para seguridad y control de acceso
5. **Funciones SQL optimizadas** para operaciones comunes
6. **Optimización de tablas** con VACUUM ANALYZE
7. **Mejora de la estructura de datos** con restricciones y validaciones

## Estructura de la Base de Datos

La base de datos consta de las siguientes tablas principales:

- **products**: Almacena información de productos
- **categories**: Almacena categorías de productos
- **brands**: Almacena marcas de productos
- **assets**: Almacena información sobre activos (imágenes)

### Diagrama de Relaciones

```
categories <---> products <---> brands
                   |
                   v
                 assets
```

## Índices

Se han creado los siguientes índices para optimizar las consultas más frecuentes:

### Tabla products

| Nombre del Índice | Columna | Tipo | Propósito |
|-------------------|---------|------|-----------|
| idx_products_name | name | btree | Mejora búsquedas por nombre |
| idx_products_slug | slug | btree | Mejora búsquedas por slug |
| idx_products_category_id | category_id | btree | Mejora filtrado por categoría |
| idx_products_brand_id | brand_id | btree | Mejora filtrado por marca |
| idx_products_name_search | name | gin | Mejora búsqueda de texto |
| idx_products_search_vector | search_vector | gin | Búsqueda de texto completo |

### Tabla categories

| Nombre del Índice | Columna | Tipo | Propósito |
|-------------------|---------|------|-----------|
| idx_categories_slug | slug | btree | Mejora búsquedas por slug |

### Tabla brands

| Nombre del Índice | Columna | Tipo | Propósito |
|-------------------|---------|------|-----------|
| idx_brands_slug | slug | btree | Mejora búsquedas por slug |

### Tabla assets

| Nombre del Índice | Columna | Tipo | Propósito |
|-------------------|---------|------|-----------|
| idx_assets_id | id | btree | Mejora búsquedas por ID |

## Vistas Materializadas

Se ha creado una vista materializada para optimizar las consultas que requieren unir productos con sus categorías y marcas:

```sql
CREATE MATERIALIZED VIEW mv_products_with_relations AS
SELECT 
  p.*,
  c.name AS category_name,
  c.slug AS category_slug,
  b.name AS brand_name,
  b.slug AS brand_slug,
  b.logo_url AS brand_logo_url
FROM 
  products p
LEFT JOIN 
  categories c ON p.category_id = c.id
LEFT JOIN 
  brands b ON p.brand_id = b.id;
```

Esta vista se actualiza automáticamente mediante triggers cuando cambian los datos en las tablas relacionadas.

## Políticas de Seguridad (RLS)

Se han implementado políticas RLS (Row Level Security) para controlar el acceso a los datos:

- **Lectura pública**: Todos los usuarios pueden leer datos de productos, categorías y marcas
- **Escritura restringida**: Solo usuarios autenticados con roles específicos pueden modificar datos

## Funciones de Búsqueda Optimizadas

Se ha creado una función SQL optimizada para la búsqueda de productos:

```sql
CREATE OR REPLACE FUNCTION search_products(
  search_term TEXT,
  category_slug TEXT DEFAULT NULL,
  brand_slug TEXT DEFAULT NULL,
  limit_val INTEGER DEFAULT 100,
  offset_val INTEGER DEFAULT 0
)
```

Esta función utiliza la columna `search_vector` y los índices creados para realizar búsquedas eficientes.

## Caché del Lado del Cliente

Se ha optimizado la caché del lado del cliente utilizando React Query:

1. **Configuración global** en `contexts/QueryProvider.tsx`:
   - Tiempo de caducidad (staleTime): 5 minutos
   - Tiempo de recolección de basura (gcTime): 10 minutos
   - Reintentos automáticos con backoff exponencial

2. **Hooks personalizados** en `hooks/useQueryData.ts`:
   - Caché específica por tipo de datos
   - Tiempos de caducidad personalizados:
     - Productos: 2 minutos
     - Categorías y marcas: 10 minutos (cambian con menos frecuencia)

3. **Invalidación selectiva** de caché cuando se modifican datos

## Monitoreo y Mantenimiento

Se ha creado un script de monitoreo (`scripts/optimize-database.js`) que:

1. Verifica la estructura de la base de datos
2. Crea y mantiene índices
3. Optimiza tablas
4. Genera informes de rendimiento

Para ejecutar el script de optimización:

```bash
node scripts/optimize-database.js
```

## Recomendaciones Adicionales

### 1. Paginación

Para consultas que devuelven muchos resultados, implementar paginación:

```typescript
// En el servicio
export async function getProducts({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<{ data: Product[], total: number }> {
  const supabase = getSupabaseClient();
  
  // Obtener el total de registros
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });
    
  if (countError) throw countError;
  
  // Obtener los datos paginados
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, slug, name),
      brand:brands(id, slug, name, logo_url)
    `)
    .order("name")
    .range(offset, offset + limit - 1);
    
  if (error) throw error;
  
  return { data: data || [], total: count || 0 };
}
```

### 2. Consultas en Lotes

Para reducir el número de peticiones, agrupar consultas relacionadas:

```typescript
// En lugar de hacer múltiples consultas
const products = await getProducts();
const categories = await getCategories();
const brands = await getBrands();

// Hacer una sola consulta que devuelva todo
const { products, categories, brands } = await getAllData();
```

### 3. Suscripciones en Tiempo Real

Para datos que cambian frecuentemente, considerar usar suscripciones de Supabase:

```typescript
const supabase = getSupabaseClient();

// Suscribirse a cambios en productos
const subscription = supabase
  .from('products')
  .on('*', (payload) => {
    console.log('Cambio en productos:', payload);
    // Actualizar la UI o invalidar la caché
  })
  .subscribe();
```

### 4. Optimización de Consultas

Limitar los campos seleccionados a los necesarios:

```typescript
// En lugar de seleccionar todo
const { data } = await supabase.from("products").select("*");

// Seleccionar solo los campos necesarios
const { data } = await supabase
  .from("products")
  .select("id, name, slug, image_url");
```

### 5. Mantenimiento Regular

Programar tareas de mantenimiento regular:

- Ejecutar VACUUM ANALYZE mensualmente
- Revisar y optimizar índices trimestralmente
- Monitorear el rendimiento de consultas frecuentes
