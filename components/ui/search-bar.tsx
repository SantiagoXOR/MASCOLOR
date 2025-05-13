"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { getProducts } from "@/lib/supabase/products";
import { Product } from "@/types";
import Image from "next/image";

/**
 * Componente de barra de búsqueda
 * Permite buscar productos en tiempo real
 */
export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce la consulta de búsqueda para evitar demasiadas solicitudes
  const debouncedQuery = useDebounce(query, 300);

  // Manejar clic fuera del componente de búsqueda
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Buscar productos cuando cambia la consulta
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await getProducts({ search: debouncedQuery, limit: 5 });
        // Verificar si el resultado es un array o un objeto con data y total
        if (Array.isArray(result)) {
          setResults(result);
        } else if (result && "data" in result) {
          setResults(result.data);
        } else {
          // Si no es ninguno de los anteriores, establecer un array vacío
          setResults([]);
        }
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  // Abrir la búsqueda y enfocar el input
  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Cerrar la búsqueda y limpiar
  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  // Navegar a la página del producto
  const navigateToProduct = (slug: string) => {
    router.push(`/productos/${slug}`);
    closeSearch();
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      {/* Botón de búsqueda */}
      <button
        onClick={openSearch}
        className="p-2 rounded-full hover:bg-mascolor-primary/10 transition-colors duration-300"
        aria-label="Buscar productos"
      >
        <Search size={20} className="text-mascolor-dark" />
      </button>

      {/* Panel de búsqueda */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mascolor-primary/50 focus:border-mascolor-primary"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Resultados de búsqueda */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-mascolor-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Buscando...</p>
              </div>
            ) : results.length > 0 ? (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => navigateToProduct(product.slug)}
                      className="w-full p-3 flex items-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="font-medium text-mascolor-dark">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category?.name} | {product.brand?.name}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            ) : null}
          </div>

          {/* Pie del panel de búsqueda */}
          <div className="p-3 border-t bg-gray-50">
            <button
              onClick={() => {
                if (query) {
                  router.push(`/busqueda?q=${encodeURIComponent(query)}`);
                  closeSearch();
                }
              }}
              className="w-full py-2 bg-mascolor-primary text-white rounded-md hover:bg-mascolor-primary/90 transition-colors duration-300"
            >
              Ver todos los resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
