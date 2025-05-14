"use client";

import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useLogger } from "@/lib/services/LoggingService";
import { useCallback } from "react";

/**
 * Hook personalizado para usar React Query con logging integrado y optimizaciones
 * @param queryKey Clave única para la consulta
 * @param queryFn Función para obtener los datos
 * @param options Opciones adicionales para la consulta
 * @returns Resultado de la consulta con funciones adicionales
 */
export function useQueryData<TData, TError = Error>(
  queryKey: string | string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">
) {
  // Convertir la clave a array si es un string
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];

  // Obtener el cliente de consulta para operaciones manuales
  const queryClient = useQueryClient();

  // Usar el logger
  const logger = useLogger(`Query:${queryKeyArray[0]}`);

  // Opciones por defecto optimizadas
  const defaultOptions: Omit<
    UseQueryOptions<TData, TError, TData>,
    "queryKey" | "queryFn"
  > = {
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (tiempo de recolección de basura)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: process.env.NODE_ENV === "production",
    refetchOnReconnect: true,
    // Las propiedades onError y onSuccess ya no son parte de UseQueryOptions en versiones recientes
    // Se manejan a través de los callbacks en useQuery
  };

  // Combinar opciones
  const mergedOptions = { ...defaultOptions, ...options };

  // Función de consulta con logging y optimizaciones
  const wrappedQueryFn = async () => {
    try {
      // Verificar si hay datos en caché y registrar
      const cachedData = queryClient.getQueryData(queryKeyArray);
      if (cachedData) {
        logger.debug("Usando datos en caché", {
          queryKey: queryKeyArray[0],
          dataAge: queryClient.getQueryState(queryKeyArray)?.dataUpdatedAt
            ? new Date().getTime() -
              queryClient.getQueryState(queryKeyArray)?.dataUpdatedAt!
            : "desconocido",
        });
      } else {
        logger.debug("Iniciando consulta a la base de datos", {
          queryKey: queryKeyArray[0],
        });
      }

      // Realizar la consulta
      const result = await queryFn();

      logger.debug("Consulta completada", {
        queryKey: queryKeyArray[0],
        dataSize: Array.isArray(result) ? result.length : "objeto",
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      logger.error("Error en consulta", {
        queryKey: queryKeyArray[0],
        error,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  // Función para invalidar manualmente la caché
  const invalidateQuery = useCallback(() => {
    logger.debug("Invalidando caché manualmente", {
      queryKey: queryKeyArray[0],
    });
    return queryClient.invalidateQueries({ queryKey: queryKeyArray });
  }, [queryClient, queryKeyArray, logger]);

  // Función para precargar datos
  const prefetchQuery = useCallback(async () => {
    logger.debug("Precargando datos", { queryKey: queryKeyArray[0] });
    await queryClient.prefetchQuery({
      queryKey: queryKeyArray,
      queryFn: wrappedQueryFn,
      ...mergedOptions,
    });
  }, [queryClient, queryKeyArray, wrappedQueryFn, mergedOptions, logger]);

  // Usar React Query
  const query = useQuery<TData, TError, TData>({
    queryKey: queryKeyArray,
    queryFn: wrappedQueryFn,
    ...mergedOptions,
  });

  // Devolver el resultado con funciones adicionales
  return {
    ...query,
    invalidateQuery,
    prefetchQuery,
  };
}

/**
 * Hook para obtener productos con React Query optimizado
 * @param options Opciones para la consulta
 * @returns Resultado de la consulta con funciones adicionales
 */
export function useProductsQuery(options?: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
  enablePagination?: boolean;
}) {
  const {
    category,
    brand,
    search,
    limit = 100,
    offset = 0,
    enablePagination = false,
  } = options || {};

  // Construir la clave de consulta
  // Convertir a string para evitar problemas de tipo
  const queryKey = [
    "products",
    JSON.stringify({ category, brand, search, limit, offset }),
  ];

  // Función para obtener productos
  const fetchProducts = async () => {
    const { getProducts } = await import("@/lib/supabase/products");

    // Si la paginación está habilitada, obtener también el total
    if (enablePagination) {
      return getProducts({
        category,
        brand,
        search,
        limit,
        offset,
        withCount: true,
      });
    }

    return getProducts({ category, brand, search, limit, offset });
  };

  return useQueryData(queryKey, fetchProducts, {
    staleTime: 2 * 60 * 1000, // 2 minutos
    // La propiedad keepPreviousData ya no existe en versiones recientes de React Query
    // Se ha reemplazado por placeholderData
  });
}

/**
 * Hook para obtener categorías con React Query optimizado
 * @returns Resultado de la consulta con funciones adicionales
 */
export function useCategoriesQuery() {
  // Función para obtener categorías
  const fetchCategories = async () => {
    const { getCategories } = await import("@/lib/supabase/products");
    return getCategories();
  };

  return useQueryData("categories", fetchCategories, {
    staleTime: 10 * 60 * 1000, // 10 minutos (cambian con menos frecuencia)
    gcTime: 30 * 60 * 1000, // 30 minutos (mantener en caché más tiempo)
  });
}

/**
 * Hook para obtener marcas con React Query optimizado
 * @returns Resultado de la consulta con funciones adicionales
 */
export function useBrandsQuery() {
  // Función para obtener marcas
  const fetchBrands = async () => {
    const { getBrands } = await import("@/lib/supabase/products");
    return getBrands();
  };

  return useQueryData("brands", fetchBrands, {
    staleTime: 10 * 60 * 1000, // 10 minutos (cambian con menos frecuencia)
    gcTime: 30 * 60 * 1000, // 30 minutos (mantener en caché más tiempo)
  });
}

/**
 * Hook para obtener datos combinados (productos, categorías y marcas) en una sola consulta
 * @param options Opciones para la consulta de productos
 * @returns Resultado de la consulta con todos los datos
 */
export function useCombinedDataQuery(options?: {
  category?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  // Construir la clave de consulta
  // Convertir a string para evitar problemas de tipo
  const queryKey = ["combinedData", options ? JSON.stringify(options) : ""];

  // Función para obtener todos los datos en paralelo
  const fetchCombinedData = async () => {
    const { getProducts, getCategories, getBrands } = await import(
      "@/lib/supabase/products"
    );

    // Ejecutar todas las consultas en paralelo
    const [products, categories, brands] = await Promise.all([
      getProducts(options || {}),
      getCategories(),
      getBrands(),
    ]);

    return {
      products,
      categories,
      brands,
    };
  };

  return useQueryData(queryKey, fetchCombinedData, {
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
