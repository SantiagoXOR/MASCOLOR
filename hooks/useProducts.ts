import { useState, useEffect, useRef } from "react";
import { Product } from "@/types";
import { getProducts } from "@/lib/supabase/products";

// Función para registrar información de depuración
const logProductsDebug = (message: string, data: any = {}) => {
  // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
  /*
  console.log(
    "%c[useProducts Debug]%c " + message,
    "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
    "color: #870064; font-weight: bold;",
    data
  );
  */
};

/**
 * Hook para obtener productos con filtros opcionales
 * @param options Opciones de filtrado
 * @returns Productos, estado de carga y error
 */
export function useProducts({
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
} = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Depuración: Registrar parámetros de filtrado
  useEffect(() => {
    logProductsDebug("Parámetros de filtrado actualizados", {
      category,
      brand,
      search,
      limit,
      offset,
    });
  }, [category, brand, search, limit, offset]);

  // Referencia para controlar si el componente está montado
  const isMountedRef = useRef(true);
  // Referencia para controlar si ya se ha realizado un reintento
  const hasRetriedRef = useRef(false);
  // Referencia para almacenar el número de productos
  const productsLengthRef = useRef(0);
  // Referencia para almacenar el error
  const errorRef = useRef<Error | null>(null);

  // Actualizar las referencias cuando cambian los valores
  useEffect(() => {
    productsLengthRef.current = products.length;
  }, [products.length]);

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  // Efecto principal para cargar productos
  useEffect(() => {
    // Asegurarse de que la referencia de montado esté actualizada
    isMountedRef.current = true;
    // Reiniciar la referencia de reintento
    hasRetriedRef.current = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
        /*
        logProductsDebug("Iniciando carga de productos", {
          category,
          brand,
          search,
        });
        */

        // Verificar que los parámetros sean válidos
        if (
          category === undefined &&
          brand === undefined &&
          search === undefined
        ) {
          /*
          logProductsDebug(
            "⚠️ No se proporcionaron filtros, cargando todos los productos"
          );
          */
        }

        // Verificar variables de entorno
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          /*
          logProductsDebug(
            "❌ Error: Variables de entorno de Supabase no configuradas",
            {
              NEXT_PUBLIC_SUPABASE_URL: supabaseUrl
                ? "Definida"
                : "No definida",
              NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey
                ? "Definida"
                : "No definida",
            }
          );
          */
          throw new Error("Variables de entorno de Supabase no configuradas");
        }

        // Usar el servicio de Supabase para obtener productos
        const data = await getProducts({
          category,
          brand,
          search,
          limit,
          offset,
        });

        // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
        /*
        logProductsDebug("Productos cargados correctamente", {
          count: data.length,
          firstProduct:
            data.length > 0
              ? {
                  id: data[0].id,
                  name: data[0].name,
                  image_url: data[0].image_url,
                  category: data[0].category?.name,
                  brand: data[0].brand?.name,
                }
              : null,
        });
        */

        // Depuración adicional: Verificar si los productos tienen todas las propiedades necesarias
        if (data.length > 0) {
          const missingProperties = data.filter(
            (p) => !p.id || !p.name || !p.image_url || !p.category || !p.brand
          );

          if (missingProperties.length > 0) {
            /*
            logProductsDebug("⚠️ Productos con propiedades faltantes", {
              count: missingProperties.length,
              productos: missingProperties.map((p) => ({
                id: p.id,
                name: p.name,
                image_url: p.image_url,
                category: p.category?.name,
                brand: p.brand?.name,
              })),
            });
            */
          }
        } else {
          /*
          logProductsDebug(
            "⚠️ No se encontraron productos con los filtros proporcionados",
            {
              category,
              brand,
              search,
            }
          );
          */
        }

        // Solo actualizar el estado si el componente sigue montado
        if (isMountedRef.current) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
        /*
        logProductsDebug("Error al cargar productos", {
          error: errorMessage,
          category,
          brand,
          search,
        });
        */

        console.error("Error al cargar productos:", err);

        // Solo actualizar el estado si el componente sigue montado
        if (isMountedRef.current) {
          setError(
            err instanceof Error
              ? err
              : new Error("Error desconocido al cargar productos")
          );
          // En caso de error, establecer productos como un array vacío
          setProducts([]);
        }
      } finally {
        // Solo actualizar el estado si el componente sigue montado
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Establecer un temporizador para volver a intentar si no hay productos después de 5 segundos
    const retryTimer = setTimeout(() => {
      // Solo reintentar si el componente sigue montado y no se ha reintentado antes
      if (
        isMountedRef.current &&
        !hasRetriedRef.current &&
        productsLengthRef.current === 0 &&
        !errorRef.current
      ) {
        hasRetriedRef.current = true;
        // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
        /*
        logProductsDebug(
          "⚠️ Reintentando carga de productos después de timeout",
          {
            category,
            brand,
            search,
          }
        );
        */
        fetchProducts();
      }
    }, 5000);

    // Limpiar el temporizador al desmontar
    return () => {
      isMountedRef.current = false;
      clearTimeout(retryTimer);
    };
  }, [category, brand, search, limit, offset, products.length, error]);

  return {
    products,
    loading,
    error,
  };
}
