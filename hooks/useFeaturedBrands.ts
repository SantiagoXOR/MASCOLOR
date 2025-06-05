import { useState, useEffect } from "react";
import { Brand } from "@/types";
import { getBrands } from "@/lib/supabase/products";

interface BrandAsset {
  bucket: string;
  background: string;
  backgroundMobile?: string;
  title: string;
}

interface BrandAssets {
  [key: string]: BrandAsset;
}

/**
 * Hook para obtener marcas destacadas con sus assets
 * @returns Marcas, assets, estado de carga y error
 */
export function useFeaturedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandAssets, setBrandAssets] = useState<BrandAssets>({
    facilfix: {
      bucket: "/images/products/facilfix-exterior-blanco.png",
      background: "/images/buckets/FACILFIX.jpg",
      backgroundMobile: "/images/buckets/FACILFIX-mobile.jpg",
      title: "Reparación y construcción profesional",
    },
    ecopainting: {
      bucket: "/images/products/ecopainting-membrana.png",
      background: "/images/buckets/ECOPAINTING.jpg",
      backgroundMobile: "/images/buckets/ECOPAINTING-mobile.jpg",
      title: "Rendimiento inteligente para obras y hogares",
    },
    newhouse: {
      bucket: "/images/products/newhouse-barniz-marino.png",
      background: "/images/buckets/NEWHOUSE.jpg",
      backgroundMobile: "/images/buckets/NEWHOUSE-mobile.jpg",
      title: "Protección total para maderas expuestas",
    },
    premium: {
      bucket: "/images/products/premium-lavable-super.png",
      background: "/images/buckets/PREMIUM.jpg",
      backgroundMobile: "/images/buckets/PREMIUM-mobile.jpg",
      title: "Acabados de alta calidad para interiores y exteriores",
    },
    expression: {
      bucket: "/images/products/expression-latex-interior.png",
      background: "/images/buckets/EXPRESSION.jpg",
      backgroundMobile: "/images/buckets/EXPRESSION-mobile.jpg",
      title: "Alta blancura y terminación profesional",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);

        // Usar el servicio de Supabase para obtener marcas
        const data = await getBrands();

        setBrands(data);

        // Actualizar los assets con datos dinámicos si están disponibles
        const updatedAssets = { ...brandAssets };

        data.forEach((brand) => {
          if (brand.slug && updatedAssets[brand.slug]) {
            // Actualizar el título si está disponible
            if (brand.description) {
              updatedAssets[brand.slug].title = brand.description;
            }

            // Verificar si existen imágenes móviles específicas
            const mobileImagePath = `/images/buckets/${brand.slug.toUpperCase()}-mobile.jpg`;
            const desktopImagePath = `/images/buckets/${brand.slug.toUpperCase()}.jpg`;

            // Actualizar rutas de imágenes con verificación
            updatedAssets[brand.slug].backgroundMobile = mobileImagePath;
            updatedAssets[brand.slug].background = desktopImagePath;

            // Si hay logo_url en Supabase, usarlo
            if (brand.logo_url) {
              // Nota: El logo se maneja directamente en el componente
            }
          }
        });

        setBrandAssets(updatedAssets);
        setError(null);
      } catch (err) {
        console.error("Error al cargar marcas destacadas:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Error desconocido al cargar marcas destacadas")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return {
    brands,
    brandAssets,
    loading,
    error,
  };
}
