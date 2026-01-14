"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoItem, BentoImage } from "@/components/ui/bento";
import { useCategoryDetails } from "@/hooks/useCategoryDetails";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
  Droplet,
  Home,
  Building,
  Layers,
  Paintbrush,
  ArrowRight,
} from "lucide-react";

const iconMap = {
  Droplet: Droplet,
  Home: Home,
  Building: Building,
  Layers: Layers,
  Paintbrush: Paintbrush,
};

export function CategoriesBento() {
  const { categories, loading, error } = useCategoryDetails();
  const { isMobile, isTablet } = useDeviceDetection();

  // Solo mostrar en móvil y tablet
  if (!isMobile && !isTablet) {
    return null;
  }

  const handleCategoryClick = (category: any) => {
    // Scroll a la sección de productos
    const productsSection = document.getElementById("productos");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }

    // Simular click en la pestaña correspondiente después del scroll
    setTimeout(() => {
      const tabBySlug = document.querySelector(
        `[data-value="${category.slug}"]`
      );
      const tabByText = Array.from(
        document.querySelectorAll('[role="tab"]')
      ).find((tab) =>
        tab.textContent?.toLowerCase().includes(category.name.toLowerCase())
      );

      if (tabBySlug) {
        (tabBySlug as HTMLElement).click();
      } else if (tabByText) {
        (tabByText as HTMLElement).click();
      }
    }, 800);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-mascolor-pink-50 lg:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse text-mascolor-primary text-lg font-bold mb-4">
              Cargando categorías...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-mascolor-pink-50 lg:hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>Error al cargar las categorías: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-mascolor-pink-50 lg:hidden">
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
            Elegí el producto{" "}
            <span className="text-mascolor-primary">indicado</span>
          </h2>
          <p className="text-mascolor-gray-600 max-w-lg mx-auto text-sm">
            Explora nuestras categorías y encuentra la solución perfecta para
            cada superficie
          </p>
        </motion.div>

        {/* BentoGrid de categorías */}
        <BentoGrid className="grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const IconComponent =
              iconMap[category.iconName as keyof typeof iconMap] || Paintbrush;

            return (
              <BentoItem
                key={category.id}
                className="cursor-pointer group hover:shadow-xl transition-all duration-300 hover:border-mascolor-primary/30 bg-white/90 backdrop-blur-sm"
                animationDelay={index * 0.1}
                motionProps={{
                  whileHover: { y: -5, scale: 1.02 },
                  whileTap: { scale: 0.98 },
                }}
              >
                <div
                  className="p-6 h-full flex flex-col"
                  onClick={() => handleCategoryClick(category)}
                >
                  {/* Imagen de fondo si está disponible */}
                  {category.image && (
                    <div className="absolute inset-0 z-0">
                      <BentoImage
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                        overlay
                        overlayColor="#870064"
                        overlayOpacity={0.1}
                      />
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icono y título */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-mascolor-primary/10 rounded-full flex items-center justify-center group-hover:bg-mascolor-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-mascolor-primary" />
                      </div>
                      <h3 className="text-lg font-mazzard font-bold text-mascolor-dark group-hover:text-mascolor-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                    </div>

                    {/* Descripción */}
                    <p className="text-mascolor-gray-600 text-sm mb-4 flex-grow">
                      {category.description ||
                        "Explora nuestra selección de productos en esta categoría"}
                    </p>

                    {/* Call to action */}
                    <div className="flex justify-between items-center">
                      <span className="text-mascolor-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                        Ver productos
                        <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>

                      {/* Contador de productos si está disponible */}
                      {category.product_count && (
                        <span className="text-xs text-mascolor-gray-500 bg-mascolor-gray-100 px-2 py-1 rounded-full">
                          {category.product_count} productos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </BentoItem>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
