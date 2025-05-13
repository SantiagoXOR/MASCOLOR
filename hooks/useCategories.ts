import { useState, useEffect } from "react";
import { Category } from "@/types";
import { getCategories } from "@/lib/supabase/products";

/**
 * Hook para obtener categorías de productos
 * @returns Categorías, estado de carga y error
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Usar el servicio de Supabase para obtener categorías
        const data = await getCategories();

        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Error desconocido al cargar categorías")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}
