"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useDebug } from "@/contexts/DebugContext";

interface ProductsDebugProps {
  products: Product[];
  filterType: "category" | "brand";
  activeCategory?: string;
  activeBrand?: string | null;
  loading: boolean;
}

export function ProductsDebug({
  products,
  filterType,
  activeCategory,
  activeBrand,
  loading,
}: ProductsDebugProps) {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  const [isOpen, setIsOpen] = useState(false);

  // Registrar información cuando cambian los productos o filtros
  useEffect(() => {
    if (isDebugEnabled && activeDebuggers.includes("products")) {
      logDebug("Estado de productos actualizado", {
        count: products.length,
        filterType,
        activeCategory,
        activeBrand,
        loading,
      });
    }
  }, [
    isDebugEnabled,
    activeDebuggers,
    logDebug,
    products,
    filterType,
    activeCategory,
    activeBrand,
    loading,
  ]);

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("products")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-mascolor-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-mascolor-primary/90 transition-colors"
      >
        {isOpen ? "Cerrar Products Debug" : "Products Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Depuración de Productos</h3>
            <span className="text-xs bg-mascolor-primary/10 text-mascolor-primary px-2 py-1 rounded">
              {products.length} productos
            </span>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Estado:</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Tipo de filtro</p>
                <p className="font-mono text-sm">{filterType}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Cargando</p>
                <p className="font-mono text-sm flex items-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-1 h-3 w-3 text-mascolor-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sí
                    </>
                  ) : (
                    "No"
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Categoría activa</p>
                <p className="font-mono text-sm truncate">
                  {activeCategory || "ninguna"}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-xs text-gray-500">Marca activa</p>
                <p className="font-mono text-sm truncate">
                  {activeBrand || "ninguna"}
                </p>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Productos:</h4>
                <button
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  onClick={() => logDebug("Productos actuales", products)}
                >
                  Log en consola
                </button>
              </div>
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded p-2 text-sm hover:border-mascolor-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold">{product.name}</p>
                      {product.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                          Destacado
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 mt-1 text-xs">
                      <p>
                        ID: <span className="font-mono">{product.id}</span>
                      </p>
                      <p>
                        Slug:{" "}
                        <span className="font-mono">
                          {product.slug || "N/A"}
                        </span>
                      </p>
                      <p>Categoría: {product.category?.name || "N/A"}</p>
                      <p>Marca: {product.brand?.name || "N/A"}</p>
                    </div>
                    <p className="truncate text-xs mt-1">
                      <span className="text-gray-500">Imagen:</span>{" "}
                      {product.image_url || "N/A"}
                    </p>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded text-center">
                    ...y {products.length - 5} productos más
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              No hay productos para mostrar con los filtros actuales.
            </div>
          )}

          <div className="mt-4 pt-2 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Filtros aplicados:</h4>
            <div className="bg-blue-50 p-2 rounded text-sm">
              {filterType === "category" ? (
                <p>
                  Filtrando por <span className="font-semibold">categoría</span>
                  : <span className="font-mono">{activeCategory}</span>
                </p>
              ) : (
                <p>
                  Filtrando por <span className="font-semibold">marca</span>:{" "}
                  <span className="font-mono">{activeBrand}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
