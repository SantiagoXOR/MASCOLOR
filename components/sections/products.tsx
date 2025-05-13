"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProductCarousel,
  ProductCarouselItem,
} from "@/components/ui/product-carousel";
import { ProductGrid } from "@/components/ui/product-grid";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Droplet, Home, Building, Layers, Palette, Star } from "lucide-react";
import { ProductsDebug, BrandLogoDebug } from "@/components/debug";

export function ProductsSection() {
  const router = useRouter();
  const {
    filterType,
    setFilterType,
    activeCategory,
    setActiveCategory,
    activeBrand,
    setActiveBrand,
    products,
    loading,
    error,
  } = useProductFilters();

  // Depuración: Registrar estado de productos
  useEffect(() => {
    console.log(
      "%c[ProductsSection Debug]%c Estado de productos:",
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;",
      {
        filterType,
        activeCategory,
        activeBrand,
        productsCount: products?.length || 0,
        loading,
        error: error ? error.message : null,
      }
    );
  }, [filterType, activeCategory, activeBrand, products, loading, error]);

  const { categories, loading: loadingCategories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands();

  // Manejar clic en un producto
  const handleProductClick = (product: Product) => {
    // Aquí podrías navegar a la página del producto
    router.push(`/productos/${product.slug}`);
  };

  // Renderizar iconos según la categoría
  const renderCategoryIcon = (slug: string) => {
    switch (slug) {
      case "especiales":
        return <Droplet size={16} />;
      case "exteriores":
        return <Building size={16} />;
      case "interiores":
        return <Home size={16} />;
      case "recubrimientos":
        return <Layers size={16} />;
      default:
        return null;
    }
  };

  // Depuración: Registrar estado de los filtros y productos
  useEffect(() => {
    // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
    /*
    console.log(
      "%c[ProductsSection Debug]%c Estado actual",
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;",
      {
        filterType,
        activeCategory,
        activeBrand,
        productsCount: products?.length || 0,
        categoriesCount: categories?.length || 0,
        brandsCount: brands?.length || 0,
        loading,
        loadingCategories,
        loadingBrands,
        error: error ? error.message : null,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? "Definida"
          : "No definida",
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "Definida"
          : "No definida",
      }
    );
    */
  }, [
    filterType,
    activeCategory,
    activeBrand,
    products,
    categories,
    brands,
    loading,
    loadingCategories,
    loadingBrands,
    error,
  ]);

  // Depuración adicional: Verificar si las categorías y marcas se están cargando correctamente
  useEffect(() => {
    if (!loadingCategories) {
      console.log(
        "%c[ProductsSection Debug]%c Categorías cargadas",
        "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
        "color: #870064; font-weight: bold;",
        {
          count: categories?.length || 0,
          categories:
            categories?.map((c) => ({
              id: c.id,
              slug: c.slug,
              name: c.name,
            })) || [],
        }
      );
    }

    if (!loadingBrands) {
      console.log(
        "%c[ProductsSection Debug]%c Marcas cargadas",
        "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
        "color: #870064; font-weight: bold;",
        {
          count: brands?.length || 0,
          brands:
            brands?.map((b) => ({ id: b.id, slug: b.slug, name: b.name })) ||
            [],
        }
      );
    }
  }, [loadingCategories, loadingBrands, categories, brands]);

  // Depuración adicional: Mostrar los primeros 3 productos
  useEffect(() => {
    // Comentamos temporalmente para resolver el error de Maximum update depth exceeded
    /*
    if (products && products.length > 0) {
      console.log(
        "%c[ProductsSection Debug]%c Productos cargados",
        "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
        "color: #870064; font-weight: bold;",
        {
          count: products.length,
          filterType,
          activeCategory,
          activeBrand,
          primeros: products.slice(0, 3).map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category?.name,
            brand: p.brand?.name,
            image_url: p.image_url,
          })),
        }
      );
    } else {
      console.log(
        "%c[ProductsSection Debug]%c No hay productos para mostrar",
        "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
        "color: #870064; font-weight: bold;",
        { filterType, activeCategory, activeBrand }
      );
    }
    */
  }, [products, filterType, activeCategory, activeBrand]);

  return (
    <section id="productos" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Componentes de depuración */}
        <ProductsDebug
          products={products}
          filterType={filterType}
          activeCategory={activeCategory}
          activeBrand={activeBrand}
          loading={loading}
        />
        <BrandLogoDebug brands={brands || []} />

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-mascolor-dark mb-3">
            Nuestros Productos
          </h2>
          <p className="text-mascolor-gray-600 max-w-2xl mx-auto">
            Descubre nuestra amplia gama de pinturas y revestimientos de alta
            calidad para tus proyectos.
          </p>
        </div>

        {/* Selector de tipo de filtro */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-gray-100 rounded-full">
            <button
              id="filter-by-category-button"
              data-filter-type="category"
              onClick={() => {
                console.log("Cambiando a filtro por categoría");
                setFilterType("category");
                if (!activeCategory && categories.length > 0) {
                  setActiveCategory(categories[0].slug);
                }
              }}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                filterType === "category"
                  ? "bg-mascolor-primary text-white shadow-md"
                  : "hover:bg-mascolor-primary/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers size={16} />
                <span className="font-medium">Por Categoría</span>
              </span>
            </button>

            <button
              id="filter-by-brand-button"
              data-filter-type="brand"
              onClick={() => {
                console.log("Cambiando a filtro por marca");
                setFilterType("brand");
                if (!activeBrand && brands.length > 0) {
                  setActiveBrand(brands[0].slug);
                }
              }}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                filterType === "brand"
                  ? "bg-mascolor-primary text-white shadow-md"
                  : "hover:bg-mascolor-primary/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={16} />
                <span className="font-medium">Por Marca</span>
              </span>
            </button>
          </div>
        </div>

        {/* Estado de carga */}
        {(loading || loadingCategories || loadingBrands) && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-mascolor-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-mascolor-primary">
              {loading && "Cargando productos..."}
              {loadingCategories && !loading && "Cargando categorías..."}
              {loadingBrands &&
                !loading &&
                !loadingCategories &&
                "Cargando marcas..."}
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">
              Error al cargar productos. Por favor, intenta nuevamente.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Detalles: {error.message}
            </p>
          </div>
        )}

        {/* Contenido principal */}
        {!loading && !error && (
          <>
            {/* Tabs de categorías */}
            {filterType === "category" &&
              categories &&
              categories.length > 0 && (
                <Tabs
                  value={activeCategory}
                  className="w-full"
                  onValueChange={(value) => {
                    console.log("Cambiando categoría a:", value);
                    setActiveCategory(value);
                  }}
                >
                  <div className="flex justify-center mb-6">
                    <TabsList className="bg-gray-100 p-1 rounded-full">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category.slug}
                          value={category.slug}
                          data-value={category.slug}
                          data-category-tab={category.slug}
                          id={`tab-category-${category.slug}`}
                          className="px-4 py-2 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white"
                        >
                          <span className="flex items-center gap-2">
                            {renderCategoryIcon(category.slug)}
                            <span>{category.name}</span>
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {categories.map((category) => (
                    <TabsContent
                      key={category.slug}
                      value={category.slug}
                      className="mt-0"
                    >
                      <div className="mb-2 text-center">
                        <p className="text-xs text-mascolor-gray-600">
                          Mostrando {products?.length || 0} productos de la
                          categoría {category.name}
                        </p>
                      </div>

                      {products && products.length > 0 ? (
                        <ProductCarousel className="mb-4">
                          {/* Usamos ProductCarouselItem para cada grupo de productos */}
                          <ProductGrid
                            products={products}
                            onProductClick={handleProductClick}
                          />
                        </ProductCarousel>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-mascolor-gray-500">
                            No hay productos disponibles para esta categoría.
                          </p>
                          <p className="text-sm text-mascolor-gray-400 mt-2">
                            Categoría actual: {category.name} ({category.slug})
                          </p>
                          <button
                            onClick={() => {
                              console.log(
                                "Intentando cargar productos para",
                                category.slug
                              );
                              setActiveCategory(category.slug);
                            }}
                            className="mt-4 px-4 py-2 bg-mascolor-primary text-white rounded-full text-sm"
                          >
                            Intentar cargar de nuevo
                          </button>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}

            {/* Tabs de marcas */}
            {filterType === "brand" && brands && brands.length > 0 && (
              <Tabs
                value={activeBrand || ""}
                className="w-full"
                onValueChange={(value) => {
                  console.log("Cambiando marca a:", value);
                  setActiveBrand(value);
                }}
              >
                <div className="flex justify-center mb-6">
                  <TabsList className="bg-gray-100 p-1 rounded-full">
                    {brands.map((brand) => (
                      <TabsTrigger
                        key={brand.slug}
                        value={brand.slug}
                        data-value={brand.slug}
                        data-brand-tab={brand.slug}
                        id={`tab-brand-${brand.slug}`}
                        className="px-4 py-2 rounded-full data-[state=active]:bg-mascolor-primary data-[state=active]:text-white"
                      >
                        <span className="flex items-center gap-2">
                          <Palette size={16} />
                          <span>{brand.name}</span>
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {brands.map((brand) => (
                  <TabsContent
                    key={brand.slug}
                    value={brand.slug}
                    className="mt-0"
                  >
                    <div className="mb-2 text-center">
                      <p className="text-xs text-mascolor-gray-600">
                        Mostrando {products?.length || 0} productos de la marca{" "}
                        {brand.name}
                      </p>
                    </div>

                    {products && products.length > 0 ? (
                      <ProductCarousel className="mb-4">
                        {/* Usamos ProductCarouselItem para cada grupo de productos */}
                        <ProductGrid
                          products={products}
                          onProductClick={handleProductClick}
                        />
                      </ProductCarousel>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-mascolor-gray-500">
                          No hay productos disponibles para esta marca.
                        </p>
                        <p className="text-sm text-mascolor-gray-400 mt-2">
                          Marca actual: {brand.name} ({brand.slug})
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}
      </div>
    </section>
  );
}
