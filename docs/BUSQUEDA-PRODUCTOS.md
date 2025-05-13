# Implementación de Búsqueda de Productos en +COLOR

Este documento detalla la implementación de la funcionalidad de búsqueda de productos en el proyecto +COLOR.

## Componentes Implementados

### 1. Hook de Debounce

Se ha implementado un hook personalizado para debounce de valores:

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

Este hook permite retrasar las consultas de búsqueda para evitar hacer demasiadas solicitudes a la base de datos mientras el usuario está escribiendo.

### 2. Componente de Barra de Búsqueda

Se ha implementado un componente de barra de búsqueda:

```typescript
// components/ui/search-bar.tsx
export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Debounce la consulta de búsqueda
  const debouncedQuery = useDebounce(query, 300);
  
  // Buscar productos cuando cambia la consulta
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const products = await getProducts({ search: debouncedQuery, limit: 5 });
        setResults(products);
      } catch (error) {
        console.error("Error al buscar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [debouncedQuery]);
  
  // ...
}
```

Este componente proporciona:
- Un botón de búsqueda que abre un panel de búsqueda
- Un campo de entrada para la consulta de búsqueda
- Resultados en tiempo real mientras el usuario escribe
- Indicador de carga durante la búsqueda
- Navegación a la página del producto al hacer clic en un resultado
- Botón para ver todos los resultados

### 3. Página de Resultados de Búsqueda

Se han implementado dos componentes para la página de resultados de búsqueda:

```typescript
// app/busqueda/page.tsx
export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const query = searchParams.q || '';
  
  return generateMetadata({
    title: `Resultados de búsqueda: ${query}`,
    description: `Resultados de búsqueda para "${query}" en +COLOR.`,
    canonical: `/busqueda?q=${encodeURIComponent(query)}`,
  });
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  return <SearchResultsPage query={query} />;
}
```

```typescript
// app/busqueda/page-client.tsx
export default function SearchResultsPage({ query }: SearchResultsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const results = await getProducts({ search: query });
        setProducts(results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al buscar productos'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);
  
  // ...
}
```

Esta página proporciona:
- Metadatos dinámicos basados en la consulta de búsqueda
- Resultados de búsqueda completos
- Indicador de carga durante la búsqueda
- Manejo de errores
- Sugerencias de categorías populares cuando no hay resultados

## Integración en el Header

La barra de búsqueda se ha integrado en el header del sitio:

```tsx
// components/layout/header.tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.15 }}
  className={isScrolled ? "text-mascolor-dark" : "text-white"}
>
  <SearchBar />
</motion.div>
```

También se ha integrado en el menú móvil:

```tsx
{/* Barra de búsqueda en móvil */}
<div className="py-2 flex justify-center">
  <SearchBar />
</div>
```

## Implementación en Supabase

La funcionalidad de búsqueda utiliza la función `getProducts` del servicio de Supabase:

```typescript
// lib/supabase/products.ts
export async function getProducts({
  category,
  brand,
  search,
  limit = 100,
  offset = 0,
}: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, slug, name),
      brand:brands(id, slug, name, logo_url)
    `)
    .order('name')
    .range(offset, offset + limit - 1);
  
  // Aplicar filtros si se proporcionan
  if (category) {
    query = query.eq('categories.slug', category);
  }
  
  if (brand) {
    query = query.eq('brands.slug', brand);
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}
```

## Beneficios de la Implementación

1. **Mejor experiencia de usuario**:
   - Búsqueda en tiempo real mientras el usuario escribe
   - Resultados visuales con imágenes de productos
   - Indicadores de carga para feedback inmediato

2. **Rendimiento optimizado**:
   - Debounce para reducir el número de solicitudes
   - Límite de resultados en la búsqueda instantánea
   - Carga diferida de resultados completos

3. **SEO mejorado**:
   - Metadatos dinámicos para páginas de resultados
   - URLs amigables para motores de búsqueda
   - Contenido relevante basado en la consulta

4. **Accesibilidad**:
   - Navegación por teclado en resultados
   - Estados de carga claramente indicados
   - Mensajes de error informativos

## Próximos Pasos

1. Implementar búsqueda avanzada con filtros adicionales
2. Mejorar la relevancia de los resultados con algoritmos más sofisticados
3. Agregar sugerencias de búsqueda basadas en búsquedas populares
