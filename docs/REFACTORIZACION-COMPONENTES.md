# Refactorización de Componentes en +COLOR

Este documento detalla la refactorización de componentes en el proyecto +COLOR para utilizar los datos dinámicos de Supabase.

## Componentes Reutilizables Creados

### 1. ProductCard

Componente para mostrar una tarjeta de producto con toda la información relevante:

```typescript
// components/ui/product-card.tsx
export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="...">
        {/* Contenido de la tarjeta */}
        <CardHeader>...</CardHeader>
        <CardContent>...</CardContent>
        <CardFooter>...</CardFooter>
      </Card>
    </motion.div>
  );
}
```

### 2. ProductGrid

Componente para mostrar una cuadrícula de productos con animaciones:

```typescript
// components/ui/product-grid.tsx
export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  // Configuración de animaciones
  const containerVariants = { ... };
  const itemVariants = { ... };
  
  // Agrupar productos en filas
  const groupedProducts = [];
  for (let i = 0; i < products.length; i += 4) {
    groupedProducts.push(products.slice(i, i + 4));
  }
  
  return (
    <>
      {groupedProducts.map((group, groupIndex) => (
        <div key={groupIndex} className="...">
          <motion.div className="grid..." variants={containerVariants} initial="hidden" whileInView="visible">
            {group.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} onClick={() => onProductClick?.(product)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </>
  );
}
```

## Componentes Refactorizados

### ProductsSection

El componente principal de la sección de productos ha sido refactorizado para usar los datos dinámicos de Supabase:

```typescript
// components/sections/products.tsx
export function ProductsSection() {
  const router = useRouter();
  const {
    filterType,
    setFilterType,
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    products,
    loading,
    error
  } = useProductFilters();
  
  const { categories, loading: loadingCategories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands();
  
  // Manejar clic en un producto
  const handleProductClick = (product: Product) => {
    router.push(`/productos/${product.slug}`);
  };
  
  // Renderizar iconos según la categoría
  const renderCategoryIcon = (slug: string) => { ... };
  
  return (
    <section id="productos" className="...">
      {/* Selector de tipo de filtro */}
      <div className="flex justify-center mb-8">...</div>
      
      {/* Estado de carga */}
      {(loading || loadingCategories || loadingBrands) && (...)}
      
      {/* Mensaje de error */}
      {error && (...)}
      
      {/* Contenido principal */}
      {!loading && !error && (
        <>
          {/* Tabs de categorías */}
          {filterType === "category" && categories.length > 0 && (...)}
          
          {/* Tabs de marcas */}
          {filterType === "brand" && brands.length > 0 && (...)}
          
          {/* Botón "Ver todos los productos" */}
          <div className="text-center mt-8">...</div>
        </>
      )}
    </section>
  );
}
```

## Mejoras Implementadas

1. **Separación de responsabilidades**:
   - Cada componente tiene una responsabilidad clara y específica
   - La lógica de filtrado se ha extraído a hooks personalizados

2. **Reutilización de código**:
   - Los componentes `ProductCard` y `ProductGrid` son reutilizables en toda la aplicación
   - Se eliminó la duplicación de código entre las vistas por categoría y por marca

3. **Mejor manejo de estados**:
   - Estados de carga y error claramente definidos
   - Feedback visual para el usuario durante la carga de datos

4. **Mejor experiencia de usuario**:
   - Animaciones suaves al mostrar productos
   - Efectos de hover en las tarjetas de productos
   - Indicadores visuales para productos destacados, nuevos, etc.

5. **Mejor mantenibilidad**:
   - Código más limpio y organizado
   - Componentes más pequeños y enfocados
   - Tipado fuerte con TypeScript

## Próximos Pasos

1. Implementar la optimización de imágenes
2. Mejorar el SEO con metadatos dinámicos
3. Implementar la funcionalidad de búsqueda
