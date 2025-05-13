import { useState, useEffect } from "react";
import { useCachedProducts } from "@/hooks/useCachedProducts";

// Función para registrar información de depuración
const logFilterDebug = (message: string, data: any = {}) => {
  // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
  /*
  console.log(
    "%c[ProductFilters Debug]%c " + message,
    "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
    "color: #870064; font-weight: bold;",
    data
  );
  */
};

/**
 * Hook para gestionar filtros de productos
 * @returns Estado y funciones para gestionar filtros
 */
export function useProductFilters() {
  // Estado para el tipo de filtro (categoría o marca)
  const [filterType, setFilterType] = useState<"category" | "brand">(
    "category"
  );
  const [activeCategory, setActiveCategory] = useState<string>("especiales");
  const [activeBrand, setActiveBrand] = useState<string | null>("facilfix"); // Inicializar con un valor por defecto
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Activar el modo de depuración en la consola
  useEffect(() => {
    console.log("🔍 Depuración de filtros activada");
    console.log("Filtros iniciales:", {
      filterType,
      activeCategory,
      activeBrand,
      searchQuery,
    });
  }, []);

  // Depuración: Registrar inicialización
  useEffect(() => {
    logFilterDebug("Inicialización de filtros", {
      filterType,
      activeCategory,
      activeBrand,
      searchQuery,
    });
  }, []);

  // Depuración: Registrar cambios en los filtros
  useEffect(() => {
    logFilterDebug("Filtros actualizados", {
      filterType,
      activeCategory,
      activeBrand,
      searchQuery,
    });
  }, [filterType, activeCategory, activeBrand, searchQuery]);

  // Obtener productos según los filtros activos usando caché para mejorar rendimiento
  const { products, loading, error, refresh } = useCachedProducts({
    category: filterType === "category" ? activeCategory : undefined,
    brand: filterType === "brand" ? activeBrand || undefined : undefined,
    search: searchQuery || undefined,
  });

  // Depuración adicional: Verificar si los productos se están cargando correctamente
  useEffect(() => {
    logFilterDebug("Estado de carga de productos", {
      loading,
      error: error ? error.message : null,
      productsCount: products?.length || 0,
      filterParams: {
        category: filterType === "category" ? activeCategory : undefined,
        brand: filterType === "brand" ? activeBrand || undefined : undefined,
        search: searchQuery || undefined,
      },
    });
  }, [
    loading,
    error,
    products,
    filterType,
    activeCategory,
    activeBrand,
    searchQuery,
  ]);

  // Depuración: Registrar los parámetros de filtrado
  useEffect(() => {
    logFilterDebug("Parámetros de filtrado enviados a useProducts", {
      category: filterType === "category" ? activeCategory : undefined,
      brand: filterType === "brand" ? activeBrand || undefined : undefined,
      search: searchQuery || undefined,
    });
  }, [filterType, activeCategory, activeBrand, searchQuery]);

  // Depuración: Registrar productos obtenidos
  useEffect(() => {
    if (!loading) {
      logFilterDebug("Productos obtenidos", {
        count: products.length,
        filterType,
        activeCategory,
        activeBrand,
        error: error ? error.message : null,
      });

      // Depuración adicional: Mostrar los primeros 3 productos
      if (products.length > 0) {
        logFilterDebug("Primeros productos", {
          productos: products.slice(0, 3).map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category?.name,
            brand: p.brand?.name,
            image_url: p.image_url,
          })),
        });
      } else {
        logFilterDebug("No hay productos para mostrar", {
          filterType,
          activeCategory,
          activeBrand,
        });
      }
    }
  }, [products, loading, error, filterType, activeCategory, activeBrand]);

  // Sincronizar con la URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log("Hash URL cambiado:", hash);

      try {
        // Extraer la parte después del # y antes de ?
        let baseHash = hash.split("?")[0].replace("#", "");

        // Extraer los parámetros después del ?
        const params = new URLSearchParams(
          hash.includes("?") ? hash.split("?")[1] : ""
        );

        // Verificar si estamos en la sección de productos
        if (baseHash === "productos" || hash.includes("#productos")) {
          console.log("Detectada sección de productos");

          // Verificar si hay un parámetro de categoría
          if (params.has("categoria")) {
            const categoria = params.get("categoria");
            console.log("Parámetro de categoría detectado:", categoria);

            if (
              [
                "especiales",
                "exteriores",
                "interiores",
                "recubrimientos",
              ].includes(categoria)
            ) {
              setFilterType("category");
              setActiveCategory(categoria);
              console.log("Categoría establecida desde URL:", categoria);
            }
          }
          // Verificar si hay un parámetro de marca
          else if (params.has("marca")) {
            const marca = params.get("marca");
            console.log("Parámetro de marca detectado:", marca);

            if (
              [
                "facilfix",
                "ecopainting",
                "newhouse",
                "premium",
                "expression",
              ].includes(marca)
            ) {
              setFilterType("brand");
              setActiveBrand(marca);
              console.log("Marca establecida desde URL:", marca);
            }
          }
        }
      } catch (error) {
        console.error("Error al procesar el hash de la URL:", error);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Ejecutar una vez al montar

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Actualizar la URL cuando cambian los filtros
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (filterType === "category" && activeCategory) {
      window.history.replaceState(null, "", `#categoria=${activeCategory}`);
      logFilterDebug("URL actualizada para categoría", { activeCategory });
    } else if (filterType === "brand" && activeBrand) {
      window.history.replaceState(null, "", `#marca=${activeBrand}`);
      logFilterDebug("URL actualizada para marca", { activeBrand });
    }
  }, [filterType, activeCategory, activeBrand]);

  return {
    filterType,
    setFilterType,
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    searchQuery,
    setSearchQuery,
    products,
    loading,
    error,
    // Exponer la función de recarga para permitir actualizaciones forzadas
    refreshProducts: refresh,
  };
}
