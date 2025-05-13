import { getSupabaseClient } from "./client";
import { Product, Category, Brand } from "@/types";

// Caché en memoria para IDs de categorías y marcas
const categoryIdCache: Record<string, string> = {};
const brandIdCache: Record<string, string> = {};

// Función para registrar información de depuración
const logServiceDebug = (message: string, data: any = {}) => {
  // Desactivar logs en producción para mejorar rendimiento
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "%c[Supabase Service Debug]%c " + message,
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;",
      data
    );
  }
};

/**
 * Obtiene todas las categorías de productos
 * @returns Lista de categorías
 */
export async function getCategories(): Promise<Category[]> {
  logServiceDebug("Obteniendo categorías");

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    logServiceDebug("Error al obtener categorías", { error });
    throw error;
  }

  logServiceDebug("Categorías obtenidas", { count: data?.length || 0 });
  return data || [];
}

/**
 * Obtiene todas las marcas de productos
 * @returns Lista de marcas
 */
export async function getBrands(): Promise<Brand[]> {
  logServiceDebug("Obteniendo marcas");

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error) {
    logServiceDebug("Error al obtener marcas", { error });
    throw error;
  }

  logServiceDebug("Marcas obtenidas", { count: data?.length || 0 });
  return data || [];
}

// Variable para almacenar en caché la existencia de search_vector
let hasSearchVectorColumn: boolean | null = null;

/**
 * Obtiene productos con filtros opcionales
 * @param options Opciones de filtrado
 * @returns Lista de productos filtrados o objeto con datos y total si withCount es true
 */
export async function getProducts({
  category,
  brand,
  search,
  limit = 100,
  offset = 0,
  withCount = false,
  fields = "*",
}: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
  withCount?: boolean;
  fields?: string;
}): Promise<Product[] | { data: Product[]; total: number }> {
  const startTime = Date.now();
  logServiceDebug("Obteniendo productos con filtros", {
    category,
    brand,
    search,
    limit,
    offset,
    withCount,
    fields,
  });

  const supabase = getSupabaseClient();

  // Determinar los campos a seleccionar
  const selectFields =
    fields === "*"
      ? `
      *,
      category:categories(id, slug, name),
      brand:brands(id, slug, name, logo_url)
    `
      : fields;

  // Iniciar la consulta base
  let query = supabase
    .from("products")
    .select(selectFields, { count: withCount ? "exact" : undefined })
    .order("name")
    .range(offset, offset + limit - 1);

  // Precargar categorías y marcas si no están en caché
  if (
    (category && !categoryIdCache[category]) ||
    (brand && !brandIdCache[brand])
  ) {
    await preloadCategoriesAndBrands();
  }

  // Aplicar filtros si se proporcionan
  if (category && categoryIdCache[category]) {
    query = query.eq("category_id", categoryIdCache[category]);
    logServiceDebug("Filtro por categoría aplicado", {
      category,
      categoryId: categoryIdCache[category],
    });
  } else if (category) {
    // Fallback a filtro directo por slug si no está en caché
    query = query.eq("categories.slug", category);
    logServiceDebug("Filtro por slug de categoría aplicado", { category });
  }

  if (brand && brandIdCache[brand]) {
    query = query.eq("brand_id", brandIdCache[brand]);
    logServiceDebug("Filtro por marca aplicado", {
      brand,
      brandId: brandIdCache[brand],
    });
  } else if (brand) {
    // Fallback a filtro directo por slug si no está en caché
    query = query.eq("brands.slug", brand);
    logServiceDebug("Filtro por slug de marca aplicado", { brand });
  }

  if (search) {
    logServiceDebug("Aplicando filtro por búsqueda", { search });

    // Verificar si ya sabemos si existe search_vector
    if (hasSearchVectorColumn === null) {
      try {
        // Solo verificar una vez por sesión
        const { data: searchVectorData } = await supabase
          .from("information_schema.columns")
          .select("column_name")
          .eq("table_name", "products")
          .eq("column_name", "search_vector")
          .maybeSingle();

        hasSearchVectorColumn =
          searchVectorData?.column_name === "search_vector";
        logServiceDebug("Verificación de search_vector", {
          exists: hasSearchVectorColumn,
        });
      } catch (error) {
        hasSearchVectorColumn = false;
        logServiceDebug("Error al verificar search_vector", { error });
      }
    }

    if (hasSearchVectorColumn) {
      // Usar búsqueda de texto completo si está disponible
      const searchTermFormatted = search
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((term) => term + ":*")
        .join(" & ");

      if (searchTermFormatted) {
        query = query.filter(
          "search_vector",
          "@@",
          `to_tsquery('spanish', '${searchTermFormatted}')`
        );
        logServiceDebug("Búsqueda de texto completo aplicada", {
          searchTerm: search,
          searchQuery: searchTermFormatted,
        });
      }
    } else {
      // Fallback a búsqueda simple con ILIKE
      query = query.ilike("name", `%${search}%`);
      logServiceDebug("Búsqueda simple aplicada", { search });
    }
  }

  try {
    // Ejecutar la consulta y medir el tiempo
    const startQueryTime = Date.now();
    let { data, error, count } = await query;
    const queryTime = Date.now() - startQueryTime;

    if (error) {
      logServiceDebug("Error al obtener productos", { error });
      throw error;
    }

    logServiceDebug("Productos obtenidos", {
      count: data?.length || 0,
      totalCount: count,
      queryTime: `${queryTime}ms`,
    });

    // Procesar los datos solo si hay resultados
    if (data && data.length > 0) {
      // IDs de los productos a excluir
      const excludedProductIds = [
        "ce235f0d-9673-4b24-8368-ae4c9a70677d", // Membrana Ecopainting 2
        "740cf73b-4495-41b0-bc4d-cd140118f7e4", // Membrana Líquida Ecopainting
      ];

      // Filtrar y procesar los productos en una sola pasada para mejorar rendimiento
      const originalLength = data.length;
      data = data
        .filter((product) => !excludedProductIds.includes(product.id))
        .map((product) => {
          // Normalizar URL de imagen
          if (product.asset_id) {
            product.image_url = `/assets/images/products/${product.asset_id}/original.webp`;
          } else if (product.image_url) {
            if (
              !product.image_url.startsWith("http://") &&
              !product.image_url.startsWith("https://") &&
              !product.image_url.startsWith("/")
            ) {
              product.image_url = "/" + product.image_url;
            }
          } else {
            product.image_url = "/images/products/placeholder.jpg";
          }

          // Asegurar que tenga slug
          if (!product.slug) {
            product.slug = product.name.toLowerCase().replace(/\s+/g, "-");
          }

          // Asegurar que tenga descripción
          if (!product.description) {
            product.description = `${product.name} - ${
              product.brand?.name || "Marca desconocida"
            }`;
          }

          return product;
        });

      logServiceDebug("Productos procesados", {
        originalCount: originalLength,
        filteredCount: data.length,
        excludedCount: originalLength - data.length,
      });
    }

    // Calcular tiempo total de ejecución
    const totalTime = Date.now() - startTime;
    logServiceDebug("Tiempo total de ejecución", {
      totalTime: `${totalTime}ms`,
    });

    // Devolver datos según el formato solicitado
    if (withCount) {
      return {
        data: data || [],
        total: count || 0,
      };
    }

    return data || [];
  } catch (error) {
    logServiceDebug("Error en la consulta de productos", { error });
    throw error;
  }
}

// Variable para controlar si ya se ha realizado la precarga
let preloadInProgress = false;
let preloadComplete = false;

/**
 * Precarga las categorías y marcas en caché
 * Esta función se puede llamar al inicio de la aplicación para mejorar el rendimiento
 */
export async function preloadCategoriesAndBrands(): Promise<void> {
  // Evitar múltiples precargas simultáneas
  if (preloadInProgress) {
    logServiceDebug("Precarga ya en progreso, esperando...");
    // Esperar a que termine la precarga actual
    while (preloadInProgress) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return;
  }

  // Si ya se completó la precarga, no hacerla de nuevo
  if (preloadComplete) {
    logServiceDebug("Precarga ya completada anteriormente");
    return;
  }

  preloadInProgress = true;
  logServiceDebug("Iniciando precarga de categorías y marcas");

  try {
    const supabase = getSupabaseClient();
    const startTime = Date.now();

    // Cargar categorías y marcas en paralelo para mayor velocidad
    const [categoriesResult, brandsResult] = await Promise.all([
      supabase.from("categories").select("id, slug"),
      supabase.from("brands").select("id, slug"),
    ]);

    // Procesar categorías
    if (categoriesResult.error) {
      logServiceDebug("Error al precargar categorías", {
        error: categoriesResult.error,
      });
    } else if (categoriesResult.data) {
      // Guardar en caché
      categoriesResult.data.forEach((category) => {
        categoryIdCache[category.slug] = category.id;
      });
      logServiceDebug("Categorías precargadas", {
        count: categoriesResult.data.length,
      });
    }

    // Procesar marcas
    if (brandsResult.error) {
      logServiceDebug("Error al precargar marcas", {
        error: brandsResult.error,
      });
    } else if (brandsResult.data) {
      // Guardar en caché
      brandsResult.data.forEach((brand) => {
        brandIdCache[brand.slug] = brand.id;
      });
      logServiceDebug("Marcas precargadas", {
        count: brandsResult.data.length,
      });
    }

    const totalTime = Date.now() - startTime;
    logServiceDebug("Precarga completada", {
      timeMs: totalTime,
      categoriesCount: Object.keys(categoryIdCache).length,
      brandsCount: Object.keys(brandIdCache).length,
    });

    preloadComplete = true;
  } catch (error) {
    logServiceDebug("Error en precarga", { error });
  } finally {
    preloadInProgress = false;
  }
}
