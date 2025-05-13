"use client";

import { Product } from "@/types";
import { ProductCard } from "@/components/ui/product-card";
import { motion } from "framer-motion";
import { ProductCarouselItem } from "@/components/ui/product-carousel";
import { useEffect, useState } from "react";

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

/**
 * Componente para mostrar una cuadrícula de productos con animaciones
 * @param products Lista de productos a mostrar
 * @param onProductClick Función a ejecutar al hacer clic en un producto
 */
export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  // Detectar si es un dispositivo móvil o de bajo rendimiento
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Efecto para detectar dispositivos de bajo rendimiento
  useEffect(() => {
    // Detectar dispositivos móviles o de bajo rendimiento
    const isMobile = window.innerWidth < 768;
    const isLowCPU = navigator.hardwareConcurrency <= 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

    setIsLowPerformanceDevice(isMobile || isLowCPU || Boolean(isLowMemory));
  }, []);

  // Depuración: Registrar productos recibidos
  console.log(
    "%c[ProductGrid Debug]%c Productos recibidos:",
    "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
    "color: #870064; font-weight: bold;",
    {
      count: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        image_url: p.image_url,
        asset_id: p.asset_id,
        category: p.category?.name,
        brand: p.brand?.name,
      })),
    }
  );

  // Depuración adicional: Verificar si hay productos sin asset_id
  const productsWithoutAssetId = products.filter((p) => !p.asset_id);
  if (productsWithoutAssetId.length > 0) {
    console.log(
      "%c[ProductGrid Debug]%c Productos sin asset_id:",
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;",
      productsWithoutAssetId.map((p) => ({
        id: p.id,
        name: p.name,
        image_url: p.image_url,
      }))
    );
  }

  // Depuración adicional: Verificar si los productos tienen todas las propiedades necesarias
  if (products.length > 0) {
    const missingProperties = products.filter(
      (p) => !p.id || !p.name || !p.image_url || !p.category || !p.brand
    );

    if (missingProperties.length > 0) {
      console.log(
        "%c[ProductGrid Debug]%c Productos con propiedades faltantes:",
        "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
        "color: #870064; font-weight: bold;",
        missingProperties.map((p) => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          category: p.category?.name,
          brand: p.brand?.name,
        }))
      );
    }
  }

  // Configuración de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Agrupar productos en grupos de 4 para el carrusel
  const groupedProducts = [];
  const productsPerSlide = 4; // 4 productos por slide en escritorio

  for (let i = 0; i < products.length; i += productsPerSlide) {
    groupedProducts.push(products.slice(i, i + productsPerSlide));
  }

  if (products.length === 0) {
    console.log(
      "%c[ProductGrid Debug]%c No hay productos disponibles",
      "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
      "color: #870064; font-weight: bold;"
    );
    return (
      <div className="text-center py-12">
        <p className="text-mascolor-gray-500">No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <>
      {groupedProducts.map((group, groupIndex) => (
        <ProductCarouselItem key={groupIndex} className="w-full">
          {isLowPerformanceDevice ? (
            // Versión sin animaciones para dispositivos de bajo rendimiento
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
              {group.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    onClick={() => onProductClick?.(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Versión con animaciones para dispositivos de alto rendimiento
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {group.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    onClick={() => onProductClick?.(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </ProductCarouselItem>
      ))}
    </>
  );
}
