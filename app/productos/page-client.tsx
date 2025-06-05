"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductsSection } from "@/components/sections/products";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/whatsapp";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";

export function ProductsPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    setFilterType,
    setActiveBrand,
    setActiveCategory,
    activeBrand,
    activeCategory,
    filterType,
  } = useProductFilters();

  const { brands, loading: loadingBrands } = useBrands();
  const { categories, loading: loadingCategories } = useCategories();

  // Manejar parámetros de URL al cargar la página
  useEffect(() => {
    if (loadingBrands || loadingCategories || isInitialized) return;

    const marca = searchParams.get("marca");
    const categoria = searchParams.get("categoria");

    console.log("Parámetros de URL detectados:", { marca, categoria });

    // Si hay parámetro de marca, configurar filtro por marca
    if (marca && brands.length > 0) {
      const brandExists = brands.find((b) => b.slug === marca);
      if (brandExists) {
        console.log("Configurando filtro por marca:", marca);
        setFilterType("brand");
        setActiveBrand(marca);
        setIsInitialized(true);
        return;
      } else {
        console.warn("Marca no encontrada:", marca);
      }
    }

    // Si hay parámetro de categoría, configurar filtro por categoría
    if (categoria && categories.length > 0) {
      const categoryExists = categories.find((c) => c.slug === categoria);
      if (categoryExists) {
        console.log("Configurando filtro por categoría:", categoria);
        setFilterType("category");
        setActiveCategory(categoria);
        setIsInitialized(true);
        return;
      } else {
        console.warn("Categoría no encontrada:", categoria);
      }
    }

    // Si no hay parámetros válidos, usar configuración por defecto
    if (!marca && !categoria && categories.length > 0) {
      console.log("Sin parámetros válidos, usando configuración por defecto");
      setFilterType("category");
      setActiveCategory(categories[0]?.slug || "");
      setIsInitialized(true);
    }
  }, [
    searchParams,
    brands,
    categories,
    loadingBrands,
    loadingCategories,
    isInitialized,
    setFilterType,
    setActiveBrand,
    setActiveCategory,
  ]);

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();

    if (filterType === "brand" && activeBrand) {
      params.set("marca", activeBrand);
    } else if (filterType === "category" && activeCategory) {
      params.set("categoria", activeCategory);
    }

    const newUrl = params.toString()
      ? `/productos?${params.toString()}`
      : "/productos";

    // Solo actualizar la URL si es diferente a la actual
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filterType, activeBrand, activeCategory, isInitialized, router]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero section para la página de productos */}
        <section className="bg-gradient-to-r from-mascolor-primary/10 to-mascolor-primary/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-mascolor-dark mb-4">
              Catálogo de Productos
            </h1>
            <p className="text-lg text-mascolor-gray-600 max-w-3xl mx-auto">
              Descubre nuestra amplia gama de pinturas y revestimientos de alta
              calidad. Filtra por marca o categoría para encontrar el producto
              perfecto para tu proyecto.
            </p>

            {/* Mostrar información del filtro activo */}
            {isInitialized && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-sm text-mascolor-gray-600">
                  {filterType === "brand" && activeBrand && (
                    <>
                      Mostrando productos de la marca:{" "}
                      <span className="font-semibold text-mascolor-primary">
                        {brands.find((b) => b.slug === activeBrand)?.name ||
                          activeBrand}
                      </span>
                    </>
                  )}
                  {filterType === "category" && activeCategory && (
                    <>
                      Mostrando productos de la categoría:{" "}
                      <span className="font-semibold text-mascolor-primary">
                        {categories.find((c) => c.slug === activeCategory)
                          ?.name || activeCategory}
                      </span>
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Sección de productos */}
        <ProductsSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
