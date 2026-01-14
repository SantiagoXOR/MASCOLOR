"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoItem, BentoImage } from "@/components/ui/bento";
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { ProductDetailModal } from "@/components/ui/product-detail-modal";
import { Product } from "@/types";
import {
  Droplet,
  Home,
  Building,
  Layers,
  Palette,
  Star,
  ArrowRight,
  Eye,
  ShoppingCart,
} from "lucide-react";

const categoryIcons = {
  especiales: Droplet,
  exteriores: Building,
  interiores: Home,
  recubrimientos: Layers,
};

export function ProductsBento() {
  const { isMobile, isTablet } = useDeviceDetection();
  const [activeCategory, setActiveCategory] = useState("especiales");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hooks para datos
  const { categories, loading: loadingCategories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands();
  const {
    products,
    loading: loadingProducts,
    activeCategory: filterCategory,
    setActiveCategory: setFilterCategory,
  } = useProductFilters();

  // Sincronizar activeCategory con el filtro
  useEffect(() => {
    if (filterCategory !== activeCategory) {
      setFilterCategory(activeCategory);
    }
  }, [activeCategory, filterCategory, setFilterCategory]);

  // Solo mostrar en móvil y tablet
  if (!isMobile && !isTablet) {
    return null;
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loadingCategories || loadingBrands) {
    return (
      <section className="py-12 bg-white lg:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-mascolor-primary text-lg font-bold mb-4">
              Cargando productos...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white lg:hidden" id="productos-bento">
      <div className="container mx-auto px-4">
        {/* Título de la sección */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-mazzard font-bold text-mascolor-dark mb-3">
            Nuestros <span className="text-mascolor-primary">productos</span>
          </h2>
          <p className="text-mascolor-gray-600 max-w-lg mx-auto text-sm">
            Descubre nuestra línea completa de pinturas y revestimientos de alta
            calidad
          </p>
        </motion.div>

        {/* Selector de categorías */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {categories.map((category) => {
            const IconComponent =
              categoryIcons[category.slug as keyof typeof categoryIcons] ||
              Palette;
            const isActive = activeCategory === category.slug;

            return (
              <Button
                key={category.slug}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 whitespace-nowrap rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-mascolor-primary text-white shadow-lg"
                    : "bg-white text-mascolor-gray-700 hover:bg-mascolor-primary/10 hover:text-mascolor-primary"
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </motion.div>

        {/* Grid de productos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {loadingProducts ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-mascolor-primary">
                  Cargando productos...
                </div>
              </div>
            ) : products && products.length > 0 ? (
              <BentoGrid className="grid-cols-1 sm:grid-cols-2 gap-4">
                {products.slice(0, 6).map((product, index) => (
                  <BentoItem
                    key={product.id}
                    className="cursor-pointer group hover:shadow-xl transition-all duration-300 hover:border-mascolor-primary/30 bg-white"
                    animationDelay={index * 0.1}
                    motionProps={{
                      whileHover: { y: -5, scale: 1.02 },
                      whileTap: { scale: 0.98 },
                    }}
                  >
                    <div
                      className="p-4 h-full flex flex-col"
                      onClick={() => handleProductClick(product)}
                    >
                      {/* Imagen del producto */}
                      <div className="relative mb-4 aspect-square rounded-xl overflow-hidden bg-mascolor-gray-50">
                        {product.image_url ? (
                          <BentoImage
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-mascolor-gray-100">
                            <Palette className="w-12 h-12 text-mascolor-gray-400" />
                          </div>
                        )}

                        {/* Badge de marca */}
                        {product.brand && (
                          <div className="absolute top-2 left-2 bg-mascolor-primary/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {product.brand.name}
                          </div>
                        )}
                      </div>

                      {/* Información del producto */}
                      <div className="flex-grow">
                        <h3 className="font-mazzard font-bold text-mascolor-dark mb-2 group-hover:text-mascolor-primary transition-colors duration-300">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-mascolor-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Características destacadas */}
                        {product.features && product.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.features
                              .slice(0, 2)
                              .map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-mascolor-primary/10 text-mascolor-primary px-2 py-1 rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex justify-between items-center pt-3 border-t border-mascolor-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-mascolor-primary hover:bg-mascolor-primary/10 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(product);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">Ver detalles</span>
                        </Button>

                        <ArrowRight className="w-4 h-4 text-mascolor-gray-400 group-hover:text-mascolor-primary group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </BentoItem>
                ))}
              </BentoGrid>
            ) : (
              <div className="text-center py-12">
                <p className="text-mascolor-gray-500 mb-4">
                  No hay productos disponibles para esta categoría.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveCategory("especiales")}
                  className="text-mascolor-primary border-mascolor-primary hover:bg-mascolor-primary/10"
                >
                  Ver productos especiales
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ver todos los productos */}
        {products && products.length > 6 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="text-mascolor-primary border-mascolor-primary hover:bg-mascolor-primary hover:text-white transition-all duration-300"
            >
              Ver todos los productos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Modal de detalles del producto */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
