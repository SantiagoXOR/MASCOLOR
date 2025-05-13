"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useDebug } from "@/contexts/DebugContext";
import { useApiCache } from "@/hooks/useApiCache";

export function SupabaseDebug() {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para obtener datos de Supabase
  const fetchSupabaseData = useCallback(async () => {
    logDebug("Iniciando consulta a Supabase");

    // Obtener URL y clave de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Variables de entorno de Supabase no configuradas");
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Obtener categorías
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .limit(10);

    if (categoriesError) {
      throw new Error(
        `Error al obtener categorías: ${categoriesError.message}`
      );
    }

    // Obtener marcas
    const { data: brandsData, error: brandsError } = await supabase
      .from("brands")
      .select("*")
      .limit(10);

    if (brandsError) {
      throw new Error(`Error al obtener marcas: ${brandsError.message}`);
    }

    // Obtener productos
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        `
        *,
        category:categories(id, slug, name),
        brand:brands(id, slug, name, logo_url)
      `
      )
      .limit(5);

    if (productsError) {
      throw new Error(`Error al obtener productos: ${productsError.message}`);
    }

    // Devolver todos los datos
    return {
      categories: categoriesData || [],
      brands: brandsData || [],
      products: productsData || [],
      supabaseInfo: {
        url: supabaseUrl,
        anonKey:
          supabaseAnonKey.substring(0, 5) +
          "..." +
          supabaseAnonKey.substring(supabaseAnonKey.length - 5),
      },
    };
  }, [logDebug]);

  // Usar el hook de caché para la API
  const {
    data: supabaseData,
    status,
    isLoading,
    refetch,
    error,
  } = useApiCache(fetchSupabaseData, {
    cacheKey: "supabase-debug",
    cacheDuration: 2 * 60 * 1000, // 2 minutos
    retryCount: 2,
    retryDelay: 1500,
    retryBackoff: true,
    onError: (err) => setErrorMessage(err.message),
  });

  // Extraer datos del resultado
  const categories = supabaseData?.categories || [];
  const brands = supabaseData?.brands || [];
  const products = supabaseData?.products || [];

  // Efecto para cargar datos cuando se abre
  useEffect(() => {
    if (isOpen && !supabaseData) {
      refetch();
    }
  }, [isOpen, supabaseData, refetch]);

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("supabase")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? "Cerrar Supabase Debug" : "Supabase Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Depuración de Supabase</h3>
            <button
              onClick={() => refetch()}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Estado:</h4>
            <div className="text-sm">
              {isLoading && (
                <div className="flex items-center text-blue-600">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
                  Cargando datos de Supabase...
                </div>
              )}
              {status === "success" && !isLoading && (
                <p className="text-green-600 flex items-center">
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Conexión exitosa con Supabase
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 flex items-center">
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Error:{" "}
                  {errorMessage ||
                    (error instanceof Error
                      ? error.message
                      : "Error desconocido")}
                </p>
              )}
            </div>
          </div>

          {supabaseData && (
            <>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">
                  Categorías ({categories.length}):
                </h4>
                <div className="text-sm border border-gray-200 rounded p-2 max-h-32 overflow-auto">
                  {categories.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay categorías disponibles
                    </p>
                  ) : (
                    <ul className="list-disc pl-4">
                      {categories.map((category) => (
                        <li key={category.id}>
                          {category.name} ({category.slug})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-1">
                  Marcas ({brands.length}):
                </h4>
                <div className="text-sm border border-gray-200 rounded p-2 max-h-32 overflow-auto">
                  {brands.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay marcas disponibles
                    </p>
                  ) : (
                    <ul className="list-disc pl-4">
                      {brands.map((brand) => (
                        <li key={brand.id}>
                          {brand.name} ({brand.slug})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-1">
                  Productos (muestra de {products.length}):
                </h4>
                <div className="text-sm border border-gray-200 rounded p-2 max-h-64 overflow-auto">
                  {products.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No hay productos disponibles
                    </p>
                  ) : (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="mb-2 pb-2 border-b border-gray-100"
                      >
                        <p className="font-medium">{product.name}</p>
                        <p>Categoría: {product.category?.name || "N/A"}</p>
                        <p>Marca: {product.brand?.name || "N/A"}</p>
                        <p className="text-xs truncate">ID: {product.id}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Configuración de Supabase:
                </p>
                <p className="text-xs">URL: {supabaseData.supabaseInfo.url}</p>
                <p className="text-xs">
                  Clave anónima: {supabaseData.supabaseInfo.anonKey}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
