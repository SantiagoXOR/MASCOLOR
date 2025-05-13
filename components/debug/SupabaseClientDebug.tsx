"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useDebug } from "@/contexts/DebugContext";
import { useApiCache } from "@/hooks/useApiCache";

export function SupabaseClientDebug() {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para obtener datos del cliente de Supabase
  const fetchClientData = useCallback(async () => {
    logDebug("Iniciando verificación del cliente de Supabase");

    // Obtener URL y clave de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Variables de entorno de Supabase no configuradas");
    }

    // Obtener cliente de Supabase
    const supabase = getSupabaseClient();

    // Obtener categorías
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("count");

    if (categoriesError) {
      throw new Error(
        `Error al obtener categorías: ${categoriesError.message}`
      );
    }

    // Obtener marcas
    const { data: brandsData, error: brandsError } = await supabase
      .from("brands")
      .select("count");

    if (brandsError) {
      throw new Error(`Error al obtener marcas: ${brandsError.message}`);
    }

    // Obtener productos
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("count");

    if (productsError) {
      throw new Error(`Error al obtener productos: ${productsError.message}`);
    }

    // Devolver información
    return {
      url: supabaseUrl,
      anonKey:
        supabaseAnonKey.substring(0, 5) +
        "..." +
        supabaseAnonKey.substring(supabaseAnonKey.length - 5),
      categories: categoriesData?.length || 0,
      brands: brandsData?.length || 0,
      products: productsData?.length || 0,
    };
  }, [logDebug]);

  // Usar el hook de caché para la API
  const {
    data: supabaseInfo,
    status,
    isLoading,
    refetch,
    error,
  } = useApiCache(fetchClientData, {
    cacheKey: "supabase-client-debug",
    cacheDuration: 3 * 60 * 1000, // 3 minutos
    retryCount: 2,
    retryDelay: 1000,
    retryBackoff: true,
    onError: (err) => setErrorMessage(err.message),
  });

  // Efecto para cargar datos cuando se abre
  useEffect(() => {
    if (isOpen && !supabaseInfo) {
      refetch();
    }
  }, [isOpen, supabaseInfo, refetch]);

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("supabaseClient")
  ) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        {isOpen ? "Cerrar Cliente Debug" : "Cliente Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Cliente de Supabase</h3>
            <button
              onClick={() => refetch()}
              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
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
                  Verificando cliente...
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
                  Cliente funcionando correctamente
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

          {supabaseInfo && (
            <>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Configuración:</h4>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <p className="mb-1">
                    URL:{" "}
                    <span className="font-mono text-xs">
                      {supabaseInfo.url}
                    </span>
                  </p>
                  <p>
                    Clave anónima:{" "}
                    <span className="font-mono text-xs">
                      {supabaseInfo.anonKey}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-1">Estadísticas:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs text-blue-600">Categorías</p>
                    <p className="text-lg font-bold text-blue-800">
                      {supabaseInfo.categories}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <p className="text-xs text-purple-600">Marcas</p>
                    <p className="text-lg font-bold text-purple-800">
                      {supabaseInfo.brands}
                    </p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-green-600">Productos</p>
                    <p className="text-lg font-bold text-green-800">
                      {supabaseInfo.products}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Última actualización: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
