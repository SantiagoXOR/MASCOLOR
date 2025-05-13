import { useState, useEffect } from "react";
import { Brand } from "@/types";
import { getBrands } from "@/lib/supabase/products";

interface BrandAsset {
  bucket: string;
  background: string;
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
      title: "Reparación y construcción profesional",
    },
    ecopainting: {
      bucket: "/images/products/ecopainting-membrana.png",
      background: "/images/buckets/ECOPAINTING.jpg",
      title: "Rendimiento inteligente para obras y hogares",
    },
    newhouse: {
      bucket: "/images/products/newhouse-barniz-marino.png",
      background: "/images/buckets/NEWHOUSE.jpg",
      title: "Protección total para maderas expuestas",
    },
    premium: {
      bucket: "/images/products/premium-lavable-super.png",
      background: "/images/buckets/PREMIUM.jpg",
      title: "Acabados de alta calidad para interiores y exteriores",
    },
    expression: {
      bucket: "/images/products/expression-latex-interior.png",
      background: "/images/buckets/EXPRESSION.jpg",
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

            // Actualizar la imagen de fondo si está disponible
            // Nota: Esto requeriría un campo adicional en la tabla de marcas
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
