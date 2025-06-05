"use client";

import { useState, useCallback } from "react";

interface UseProductDetailModalReturn {
  isOpen: boolean;
  productId: string | null;
  productSlug: string | null;
  openModal: (productId?: string, productSlug?: string) => void;
  closeModal: () => void;
  navigateToProduct: (productId: string) => void;
}

/**
 * Hook personalizado para manejar el estado del modal de detalles del producto
 * @returns Estado y funciones para controlar el modal
 */
export function useProductDetailModal(): UseProductDetailModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [productSlug, setProductSlug] = useState<string | null>(null);

  const openModal = useCallback((id?: string, slug?: string) => {
    setProductId(id || null);
    setProductSlug(slug || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Limpiar después de un pequeño delay para permitir que la animación termine
    setTimeout(() => {
      setProductId(null);
      setProductSlug(null);
    }, 300);
  }, []);

  const navigateToProduct = useCallback((id: string) => {
    setProductId(id);
    setProductSlug(null);
    // No cerrar el modal, solo cambiar el producto
  }, []);

  return {
    isOpen,
    productId,
    productSlug,
    openModal,
    closeModal,
    navigateToProduct,
  };
}
