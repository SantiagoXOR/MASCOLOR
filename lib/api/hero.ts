import { getSupabaseClient } from "@/lib/supabase/client";
import { HeroContent } from "@/types/hero";
import { Brand, Product } from "@/types";

// Datos de respaldo en caso de error
const fallbackHeroContent: HeroContent = {
  headline: "Pinturas y revestimientos de alta calidad",
  subheadline: "Para tus proyectos de construcción y decoración",
  productTitle: "Expression Látex Acrílico Interior",
  backgroundImageUrl: "/images/buckets/EXPRESSION-mobile.jpg",
  productImageUrl: "/images/products/expression-latex-interior.png",
  logoUrl: "/images/logos/+colorsolo.svg",
  productBrandLogoUrl: "/images/logos/expression.svg",
  phone: "0800-555-0189",
  advisor: {
    name: "Leandro",
    role: "Asesor técnico",
    iconUrl: "/images/advisor.jpg",
  },
  benefitItems: [
    {
      title: "Alta cobertura",
      subtitle: "Menos manos",
      icon: "/images/icons/coverage.svg",
    },
    {
      title: "Secado rápido",
      subtitle: "1-2 horas",
      icon: "/images/icons/time.svg",
    },
    {
      title: "Lavable",
      subtitle: "Fácil limpieza",
      icon: "/images/icons/washable.svg",
    },
  ],
};

/**
 * Obtiene el contenido para la sección Hero desde Supabase
 *
 * Esta función consulta varias tablas en Supabase para obtener datos dinámicos:
 * - hero_content: Configuración general del hero (títulos, teléfono, etc.)
 * - products: Producto destacado a mostrar en el hero
 * - brands: Marca del producto destacado
 * - product_features: Beneficios destacados a mostrar
 * - advisors: Información del asesor técnico
 *
 * Si alguna de estas tablas no existe o no contiene datos, se utilizan valores predeterminados.
 *
 * @returns Datos estructurados para el componente HeroBento
 */
export async function getHeroContent(): Promise<HeroContent> {
  try {
    // Obtener cliente de Supabase
    const supabase = getSupabaseClient();

    // 1. Obtener configuración del hero desde la tabla hero_content (si existe)
    const { data: heroConfig, error: heroError } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .single();

    if (heroError) {
      // PGRST116 es el código para "no se encontraron resultados"
      if (heroError.code === "PGRST116") {
        console.log(
          "No se encontraron configuraciones activas del hero, usando valores predeterminados"
        );
      } else {
        console.error("Error al obtener configuración del hero:", heroError);
      }
      // Continuamos con valores predeterminados
    }

    // 2. Obtener producto destacado
    const { data: featuredProduct, error: productError } = await supabase
      .from("products")
      .select(
        `
        *,
        brand:brands(id, slug, name, logo_url, description)
      `
      )
      .eq("badge", "featured")
      .single();

    if (productError) {
      if (productError.code === "PGRST116") {
        console.log(
          "No se encontró un producto destacado con badge='featured', usando valores predeterminados"
        );
      } else if (productError.code === "42P01") {
        console.log(
          "La tabla products no existe, usando valores predeterminados"
        );
      } else {
        console.error("Error al obtener producto destacado:", {
          code: productError.code,
          message: productError.message,
          details: productError.details,
          hint: productError.hint,
        });
      }
      // Continuamos con valores predeterminados
    } else if (featuredProduct) {
      console.log("✅ Producto destacado obtenido:", {
        id: featuredProduct.id,
        name: featuredProduct.name,
        brand: (featuredProduct as any)?.brand?.name || "Sin marca",
      });
    }

    // 3. Obtener beneficios destacados
    const { data: benefits, error: benefitsError } = await supabase
      .from("product_features")
      .select("*")
      .eq("is_highlighted", true)
      .order("display_order")
      .limit(3);

    if (benefitsError) {
      if (benefitsError.code === "PGRST116") {
        console.log(
          "No se encontraron beneficios destacados, usando valores predeterminados"
        );
      } else if (benefitsError.code === "42P01") {
        console.log(
          "La tabla product_features no existe, usando valores predeterminados"
        );
      } else if (benefitsError.code === "42703") {
        console.log(
          "El campo is_highlighted no existe en product_features, usando valores predeterminados"
        );
      } else {
        console.error("Error al obtener beneficios:", {
          code: benefitsError.code,
          message: benefitsError.message,
          details: benefitsError.details,
          hint: benefitsError.hint,
        });
      }
      // Continuamos con valores predeterminados
    } else if (benefits && benefits.length > 0) {
      console.log(`✅ ${benefits.length} beneficios obtenidos desde Supabase`);
    }

    // 4. Obtener información del asesor
    const { data: advisor, error: advisorError } = await supabase
      .from("advisors")
      .select("*")
      .eq("is_active", true)
      .single();

    if (advisorError) {
      if (advisorError.code === "PGRST116") {
        console.log(
          "No se encontró información del asesor activo, usando valores predeterminados"
        );
      } else if (advisorError.code === "42P01") {
        console.log(
          "La tabla advisors no existe, usando valores predeterminados"
        );
      } else if (advisorError.code === "42703") {
        console.log(
          "El campo is_active no existe en advisors, usando valores predeterminados"
        );
      } else {
        console.error("Error al obtener información del asesor:", {
          code: advisorError.code,
          message: advisorError.message,
          details: advisorError.details,
          hint: advisorError.hint,
        });
      }
      // Continuamos con valores predeterminados
    } else if (advisor) {
      console.log("✅ Información del asesor obtenida:", {
        name: advisor.name,
        role: advisor.role,
      });
    }

    // Construir el objeto HeroContent con los datos obtenidos o valores predeterminados
    const heroContent: HeroContent = {
      // Datos básicos del hero
      headline:
        (heroConfig?.headline as string) || fallbackHeroContent.headline,
      subheadline:
        (heroConfig?.subheadline as string) || fallbackHeroContent.subheadline,

      // Datos del producto destacado
      productTitle:
        (featuredProduct?.name as string) || fallbackHeroContent.productTitle,
      backgroundImageUrl:
        (featuredProduct?.background_image_url as string) ||
        fallbackHeroContent.backgroundImageUrl,
      productImageUrl:
        (featuredProduct?.image_url as string) ||
        fallbackHeroContent.productImageUrl,

      // Logos
      logoUrl: (heroConfig?.logo_url as string) || fallbackHeroContent.logoUrl,
      productBrandLogoUrl:
        ((featuredProduct as any)?.brand?.logo_url as string) ||
        fallbackHeroContent.productBrandLogoUrl,

      // Contacto
      phone: (heroConfig?.phone as string) || fallbackHeroContent.phone,

      // Asesor
      advisor: {
        name: (advisor?.name as string) || fallbackHeroContent.advisor.name,
        role: (advisor?.role as string) || fallbackHeroContent.advisor.role,
        iconUrl:
          (advisor?.image_url as string) || fallbackHeroContent.advisor.iconUrl,
      },

      // Beneficios
      benefitItems:
        benefits && benefits.length > 0
          ? benefits.map((benefit) => ({
              title: (benefit.title as string) || "",
              subtitle: (benefit.description as string) || "",
              icon:
                (benefit.icon_url as string) ||
                `/images/icons/${(benefit.slug as string) || "default"}.svg`,
            }))
          : fallbackHeroContent.benefitItems,
    };

    return heroContent;
  } catch (error) {
    console.error("Error al obtener contenido del Hero:", error);

    // Devolver datos de respaldo en caso de error
    return fallbackHeroContent;
  }
}
