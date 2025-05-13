"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/supabase/products";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { useRouter } from "next/navigation";

interface SearchResultsPageProps {
  query: string;
}

/**
 * Componente cliente para la página de resultados de búsqueda
 * @param query Consulta de búsqueda
 * @returns Componente de página
 */
export default function SearchResultsPage({ query }: SearchResultsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  
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
  
  const handleProductClick = (product: Product) => {
    router.push(`/productos/${product.slug}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Resultados para "${query}"` : 'Buscar productos'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-mascolor-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>Error al buscar productos: {error.message}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {query ? (
            <>
              <p className="text-xl mb-4">No se encontraron productos para "{query}"</p>
              <p className="text-mascolor-gray-600">
                Intenta con otra búsqueda o explora nuestras categorías de productos.
              </p>
            </>
          ) : (
            <p className="text-xl">Ingresa un término de búsqueda para encontrar productos</p>
          )}
        </div>
      )}
      
      {/* Sugerencias de categorías populares */}
      {products.length === 0 && !loading && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Categorías populares</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => router.push('/#productos?categoria=interiores')}
              className="px-4 py-2 bg-gray-100 hover:bg-mascolor-primary/10 rounded-full transition-colors duration-300"
            >
              Pinturas para interiores
            </button>
            <button 
              onClick={() => router.push('/#productos?categoria=exteriores')}
              className="px-4 py-2 bg-gray-100 hover:bg-mascolor-primary/10 rounded-full transition-colors duration-300"
            >
              Pinturas para exteriores
            </button>
            <button 
              onClick={() => router.push('/#productos?categoria=especiales')}
              className="px-4 py-2 bg-gray-100 hover:bg-mascolor-primary/10 rounded-full transition-colors duration-300"
            >
              Productos especiales
            </button>
            <button 
              onClick={() => router.push('/#productos?categoria=recubrimientos')}
              className="px-4 py-2 bg-gray-100 hover:bg-mascolor-primary/10 rounded-full transition-colors duration-300"
            >
              Recubrimientos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
