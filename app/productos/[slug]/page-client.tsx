"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useRelatedProducts } from "@/hooks/useProductDetails";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductBadge } from "@/components/ui/product-badge";
import { ProductIcon } from "@/components/ui/product-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { shareProduct, openWhatsAppContact } from "@/lib/utils/share";

interface ProductDetailPageProps {
  product: Product;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { relatedProducts } = useRelatedProducts(product, 4);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShare = async () => {
    try {
      await shareProduct(product);
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const handleWhatsAppContact = () => {
    openWhatsAppContact(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/#productos"
              className="flex items-center text-mascolor-primary hover:text-mascolor-primary/80 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver al catálogo
            </Link>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-mascolor-gray-600 hover:text-mascolor-primary"
            >
              <Share2 size={18} className="mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Imagen del producto */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden"
              >
                {/* Badges */}
                {product.badge && (
                  <div className="absolute top-4 right-4 z-20">
                    <ProductBadge type={product.badge} />
                  </div>
                )}

                {/* Icon */}
                {product.icon && (
                  <div className="absolute bottom-4 left-4 z-20">
                    <ProductIcon type={product.icon as any} />
                  </div>
                )}

                {/* Imagen principal */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className={`object-contain drop-shadow-lg transition-opacity duration-500 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      priority
                      onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-mascolor-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Brand logo */}
              {product.brand && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="bg-white shadow-md rounded-lg px-6 py-3 border border-gray-100">
                    <img
                      src={
                        product.brand.logo_url ||
                        `/images/logos/${product.brand.slug}.svg`
                      }
                      alt={`Logo ${product.brand.name}`}
                      className="h-10 object-contain"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Información del producto */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Título y categoría */}
              <div>
                <h1 className="text-3xl font-bold text-mascolor-dark mb-3">
                  {product.name}
                </h1>
                {product.category && (
                  <Badge variant="secondary" className="mb-4">
                    {product.category.name}
                  </Badge>
                )}
                <p className="text-mascolor-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Especificaciones técnicas */}
              {(product.coverage || product.coats) && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-mascolor-dark">
                    Especificaciones Técnicas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.coverage && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-mascolor-gray-600 mb-1">
                          Cobertura
                        </p>
                        <p className="text-xl font-semibold text-mascolor-dark">
                          {product.coverage} m²/L
                        </p>
                      </div>
                    )}
                    {product.coats && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-mascolor-gray-600 mb-1">
                          Manos recomendadas
                        </p>
                        <p className="text-xl font-semibold text-mascolor-dark">
                          {product.coats}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Características adicionales */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-mascolor-dark">
                    Características
                  </h3>
                  <div className="space-y-3">
                    {product.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-mascolor-gray-600 font-medium">
                          {feature.name}
                        </span>
                        <span className="font-semibold text-mascolor-dark">
                          {feature.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="space-y-3 pt-6">
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Consultar por WhatsApp
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-mascolor-primary text-mascolor-primary hover:bg-mascolor-primary hover:text-white text-lg py-3"
                >
                  <Share2 size={20} className="mr-2" />
                  Compartir producto
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-mascolor-dark mb-8 text-center">
                Productos Relacionados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onClick={() => {
                      window.location.href = `/productos/${relatedProduct.slug}`;
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
