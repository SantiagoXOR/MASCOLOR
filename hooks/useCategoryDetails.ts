import { useState, useEffect } from "react";
import { Category } from "@/types";
import { getCategories } from "@/lib/supabase/products";

interface CategoryDetail extends Category {
  iconName: string;
  color: string;
  image: string;
}

/**
 * Hook para obtener categorías con detalles adicionales para la UI
 * @returns Categorías con detalles, estado de carga y error
 */
export function useCategoryDetails() {
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mapeo de iconos según el slug de la categoría
  const getIconBySlug = (slug: string): string => {
    switch (slug) {
      case "especiales":
        return "Droplet";
      case "exteriores":
        return "Building";
      case "interiores":
        return "Home";
      case "recubrimientos":
        return "Layers";
      default:
        return "Paintbrush";
    }
  };

  // Mapeo de colores según el slug de la categoría
  const getColorBySlug = (slug: string) => {
    switch (slug) {
      case "especiales":
        return "bg-mascolor-pink-400 text-mascolor-pink-800";
      case "exteriores":
        return "bg-mascolor-pink-200 text-mascolor-pink-800";
      case "interiores":
        return "bg-mascolor-pink-100 text-mascolor-pink-800";
      case "recubrimientos":
        return "bg-mascolor-pink-300 text-mascolor-pink-800";
      default:
        return "bg-mascolor-pink-200 text-mascolor-pink-800";
    }
  };

  // Mapeo de imágenes según el slug de la categoría
  const getImageBySlug = (slug: string) => {
    return `/images/backgrounds/${slug.toUpperCase()}.jpg`;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        // Usar el servicio de Supabase para obtener categorías
        const data = await getCategories();

        // Enriquecer las categorías con detalles adicionales para la UI
        const categoriesWithDetails = data.map((category) => ({
          ...category,
          iconName: getIconBySlug(category.slug),
          color: getColorBySlug(category.slug),
          image: getImageBySlug(category.slug),
        }));

        setCategories(categoriesWithDetails);
        setError(null);
      } catch (err) {
        console.error("Error al cargar categorías con detalles:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Error desconocido al cargar categorías con detalles")
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
