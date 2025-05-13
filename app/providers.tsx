"use client";

import { ReactNode, useEffect } from "react";
import { QueryProvider } from "@/contexts/QueryProvider";
import { preloadCategoriesAndBrands } from "@/lib/supabase/products";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Precargar datos al inicio para mejorar el rendimiento
  useEffect(() => {
    // Precargar categorías y marcas en caché
    const preloadData = async () => {
      try {
        await preloadCategoriesAndBrands();
        console.log("✅ Datos precargados correctamente");
      } catch (error) {
        console.error("❌ Error al precargar datos:", error);
      }
    };

    preloadData();
  }, []);

  return <QueryProvider>{children}</QueryProvider>;
}
