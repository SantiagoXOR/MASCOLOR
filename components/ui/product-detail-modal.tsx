"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import {
  useProductDetails,
  useRelatedProducts,
} from "@/hooks/useProductDetails";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { ProductBadge } from "./product-badge";
import { ProductIcon } from "./product-icon";
import { Button } from "./button";
import { Badge } from "./badge";
import { shareProduct, openWhatsAppContact } from "@/lib/utils/share";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productSlug?: string;
  onNavigateToProduct?: (productId: string) => void;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  productId,
  productSlug,
  onNavigateToProduct,
}: ProductDetailModalProps) {
  const { product, loading, error } = useProductDetails({
    productId,
    productSlug,
  });
  const { relatedProducts } = useRelatedProducts(product, 4);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Resetear índice de imagen cuando cambia el producto
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleShare = async () => {
    if (!product) return;

    try {
      await shareProduct(product);
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  const handleWhatsAppContact = () => {
    if (!product) return;
    openWhatsAppContact(product);
  };

  const navigateToRelatedProduct = (relatedProduct: Product) => {
    if (onNavigateToProduct) {
      onNavigateToProduct(relatedProduct.id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-mascolor-dark">
              Detalles del Producto
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-mascolor-gray-600 hover:text-mascolor-primary"
              >
                <Share2 size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-mascolor-gray-600 hover:text-mascolor-primary"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-mascolor-primary" />
                <span className="ml-2 text-mascolor-gray-600">
                  Cargando producto...
                </span>
              </div>
            )}

            {error && (
              <div className="p-6 text-center">
                <p className="text-red-500 mb-4">Error al cargar el producto</p>
                <p className="text-sm text-mascolor-gray-500">
                  {error.message}
                </p>
              </div>
            )}

            {product && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Imagen del producto */}
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden">
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
                            className="object-contain drop-shadow-lg"
                            priority
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brand logo */}
                    {product.brand && (
                      <div className="flex justify-center">
                        <div className="bg-white shadow-md rounded-lg px-4 py-2 border border-gray-100">
                          <img
                            src={
                              product.brand.logo_url ||
                              `/images/logos/${product.brand.slug}.svg`
                            }
                            alt={`Logo ${product.brand.name}`}
                            className="h-8 object-contain"
                            style={{
                              filter:
                                "brightness(0) saturate(100%) invert(10%) sepia(100%) saturate(5000%) hue-rotate(310deg) brightness(70%) contrast(100%)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-6">
                    {/* Título y categoría */}
                    <div>
                      <h1 className="text-2xl font-bold text-mascolor-dark mb-2">
                        {product.name}
                      </h1>
                      {product.category && (
                        <Badge variant="secondary" className="mb-4">
                          {product.category.name}
                        </Badge>
                      )}
                      <p className="text-mascolor-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Especificaciones técnicas */}
                    {(product.coverage || product.coats) && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-mascolor-dark">
                          Especificaciones Técnicas
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {product.coverage && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-mascolor-gray-600">
                                Cobertura
                              </p>
                              <p className="font-semibold text-mascolor-dark">
                                {product.coverage} m²/L
                              </p>
                            </div>
                          )}
                          {product.coats && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-mascolor-gray-600">
                                Manos recomendadas
                              </p>
                              <p className="font-semibold text-mascolor-dark">
                                {product.coats}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Características adicionales */}
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-mascolor-dark">
                          Características
                        </h3>
                        <div className="space-y-2">
                          {product.features.map((feature) => (
                            <div
                              key={feature.id}
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                            >
                              <span className="text-mascolor-gray-600">
                                {feature.name}
                              </span>
                              <span className="font-medium text-mascolor-dark">
                                {feature.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleWhatsAppContact}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle size={18} className="mr-2" />
                        Consultar por WhatsApp
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full border-mascolor-primary text-mascolor-primary hover:bg-mascolor-primary hover:text-white"
                      >
                        <Share2 size={18} className="mr-2" />
                        Compartir producto
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Productos relacionados */}
                {relatedProducts.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-mascolor-dark mb-6">
                      Productos Relacionados
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {relatedProducts.map((relatedProduct) => (
                        <div
                          key={relatedProduct.id}
                          className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            navigateToRelatedProduct(relatedProduct)
                          }
                        >
                          <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                            <Image
                              src={relatedProduct.image_url}
                              alt={relatedProduct.name}
                              width={120}
                              height={120}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <h4 className="text-sm font-medium text-mascolor-dark line-clamp-2">
                            {relatedProduct.name}
                          </h4>
                          <p className="text-xs text-mascolor-gray-600 mt-1">
                            {relatedProduct.brand?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
