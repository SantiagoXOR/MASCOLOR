"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { getProductById, getProductBySlug } from "@/lib/supabase/products";

interface UseProductDetailsProps {
  productId?: string;
  productSlug?: string;
}

interface UseProductDetailsReturn {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para obtener los detalles completos de un producto
 * @param productId ID del producto (opcional)
 * @param productSlug Slug del producto (opcional)
 * @returns Estado del producto, loading, error y función de refetch
 */
export function useProductDetails({
  productId,
  productSlug,
}: UseProductDetailsProps): UseProductDetailsReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async () => {
    if (!productId && !productSlug) {
      setError(new Error("Se requiere productId o productSlug"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let productData: Product | null = null;

      if (productId) {
        productData = await getProductById(productId);
      } else if (productSlug) {
        productData = await getProductBySlug(productSlug);
      }

      if (!productData) {
        setError(new Error("Producto no encontrado"));
        setProduct(null);
      } else {
        setProduct(productData);
      }
    } catch (err) {
      console.error("Error al obtener detalles del producto:", err);
      setError(err instanceof Error ? err : new Error("Error desconocido"));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProduct();
  };

  useEffect(() => {
    fetchProduct();
  }, [productId, productSlug]);

  return {
    product,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener productos relacionados (misma categoría o marca)
 * @param currentProduct Producto actual
 * @param limit Límite de productos a obtener
 * @returns Lista de productos relacionados
 */
export function useRelatedProducts(currentProduct: Product | null, limit: number = 4) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentProduct) {
      setRelatedProducts([]);
      return;
    }

    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Importar dinámicamente para evitar dependencias circulares
        const { getProducts } = await import("@/lib/supabase/products");
        
        // Primero intentar obtener productos de la misma categoría
        let products: Product[] = [];
        
        if (currentProduct.category?.slug) {
          const categoryProducts = await getProducts({
            category: currentProduct.category.slug,
            limit: limit + 1, // +1 para excluir el producto actual
          });
          
          // Filtrar el producto actual
          products = (Array.isArray(categoryProducts) ? categoryProducts : categoryProducts.data || [])
            .filter((p: Product) => p.id !== currentProduct.id)
            .slice(0, limit);
        }

        // Si no hay suficientes productos de la misma categoría, completar con productos de la misma marca
        if (products.length < limit && currentProduct.brand?.slug) {
          const brandProducts = await getProducts({
            brand: currentProduct.brand.slug,
            limit: limit + 1,
          });
          
          const filteredBrandProducts = (Array.isArray(brandProducts) ? brandProducts : brandProducts.data || [])
            .filter((p: Product) => 
              p.id !== currentProduct.id && 
              !products.some(existing => existing.id === p.id)
            )
            .slice(0, limit - products.length);
          
          products = [...products, ...filteredBrandProducts];
        }

        setRelatedProducts(products);
      } catch (err) {
        console.error("Error al obtener productos relacionados:", err);
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct, limit]);

  return {
    relatedProducts,
    loading,
    error,
  };
}
