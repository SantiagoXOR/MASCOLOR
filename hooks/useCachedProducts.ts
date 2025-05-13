'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/lib/supabase/products';

// Caché en memoria para productos
const productsCache: Record<string, {
  data: Product[],
  timestamp: number,
  total?: number
}> = {};

// Tiempo de expiración de la caché en milisegundos (2 minutos)
const CACHE_EXPIRATION = 2 * 60 * 1000;

/**
 * Genera una clave de caché basada en los parámetros de filtrado
 */
const generateCacheKey = (params: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): string => {
  return JSON.stringify({
    category: params.category || null,
    brand: params.brand || null,
    search: params.search || null,
    limit: params.limit || 100,
    offset: params.offset || 0,
  });
};

/**
 * Hook para obtener productos con caché para mejorar el rendimiento
 */
export function useCachedProducts({
  category,
  brand,
  search,
  limit = 100,
  offset = 0,
  enablePagination = false,
}: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
  enablePagination?: boolean;
} = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Referencia para controlar si el componente está montado
  const isMountedRef = useRef(true);
  
  // Efecto para limpiar la referencia al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Efecto para cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Generar clave de caché
        const cacheKey = generateCacheKey({ category, brand, search, limit, offset });
        
        // Verificar si hay datos en caché y no han expirado
        const cachedData = productsCache[cacheKey];
        const now = Date.now();
        
        if (cachedData && (now - cachedData.timestamp) < CACHE_EXPIRATION) {
          // Usar datos de caché
          if (isMountedRef.current) {
            setProducts(cachedData.data);
            if (enablePagination && cachedData.total !== undefined) {
              setTotal(cachedData.total);
            }
            setError(null);
            setLoading(false);
          }
          return;
        }
        
        // Obtener datos frescos
        const result = await getProducts({
          category,
          brand,
          search,
          limit,
          offset,
          withCount: enablePagination,
        });
        
        // Actualizar estado solo si el componente sigue montado
        if (isMountedRef.current) {
          if (enablePagination && 'data' in result && 'total' in result) {
            setProducts(result.data);
            setTotal(result.total);
            
            // Guardar en caché
            productsCache[cacheKey] = {
              data: result.data,
              timestamp: now,
              total: result.total
            };
          } else {
            setProducts(result as Product[]);
            
            // Guardar en caché
            productsCache[cacheKey] = {
              data: result as Product[],
              timestamp: now
            };
          }
          
          setError(null);
        }
      } catch (err) {
        // Actualizar estado de error solo si el componente sigue montado
        if (isMountedRef.current) {
          setError(err instanceof Error ? err : new Error('Error al cargar productos'));
          setProducts([]);
        }
      } finally {
        // Actualizar estado de carga solo si el componente sigue montado
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    fetchProducts();
  }, [category, brand, search, limit, offset, enablePagination]);
  
  return {
    products,
    total,
    loading,
    error,
    // Método para forzar una recarga ignorando la caché
    refresh: async () => {
      const cacheKey = generateCacheKey({ category, brand, search, limit, offset });
      // Eliminar de la caché
      delete productsCache[cacheKey];
      
      // Volver a cargar
      setLoading(true);
      try {
        const result = await getProducts({
          category,
          brand,
          search,
          limit,
          offset,
          withCount: enablePagination,
        });
        
        if (enablePagination && 'data' in result && 'total' in result) {
          setProducts(result.data);
          setTotal(result.total);
          productsCache[cacheKey] = {
            data: result.data,
            timestamp: Date.now(),
            total: result.total
          };
        } else {
          setProducts(result as Product[]);
          productsCache[cacheKey] = {
            data: result as Product[],
            timestamp: Date.now()
          };
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al recargar productos'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
  };
}
