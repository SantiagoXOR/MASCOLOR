"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDebug } from "@/contexts/DebugContext";

// Tipos para el hook
type ApiStatus = "idle" | "loading" | "success" | "error";
type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

interface ApiCacheOptions {
  cacheKey: string;
  cacheDuration?: number; // Duración de la caché en milisegundos
  retryCount?: number; // Número de reintentos
  retryDelay?: number; // Retraso entre reintentos en milisegundos
  retryBackoff?: boolean; // Si se debe usar backoff exponencial
  onSuccess?: (data: any) => void; // Callback en caso de éxito
  onError?: (error: Error) => void; // Callback en caso de error
}

// Caché global para compartir entre instancias del hook
const globalCache: Record<string, CacheItem<any>> = {};

/**
 * Hook personalizado para gestionar llamadas a la API con caché
 */
export function useApiCache<T = any>(
  fetchFn: () => Promise<T>,
  options: ApiCacheOptions
) {
  const {
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutos por defecto
    retryCount = 3,
    retryDelay = 1000,
    retryBackoff = true,
    onSuccess,
    onError,
  } = options;

  const { logDebug } = useDebug();
  
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ApiStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  
  // Referencia para controlar si el componente está montado
  const isMounted = useRef(true);
  
  // Función para verificar si la caché es válida
  const isCacheValid = useCallback((cacheItem: CacheItem<T> | undefined): boolean => {
    if (!cacheItem) return false;
    return Date.now() < cacheItem.expiresAt;
  }, []);
  
  // Función para obtener datos de la caché
  const getFromCache = useCallback((): T | null => {
    const cacheItem = globalCache[cacheKey] as CacheItem<T> | undefined;
    
    if (isCacheValid(cacheItem)) {
      logDebug(`Usando datos en caché para: ${cacheKey}`, {
        age: Date.now() - cacheItem!.timestamp,
        expiresIn: cacheItem!.expiresAt - Date.now(),
      });
      return cacheItem!.data;
    }
    
    return null;
  }, [cacheKey, isCacheValid, logDebug]);
  
  // Función para guardar datos en la caché
  const saveToCache = useCallback((data: T): void => {
    const now = Date.now();
    globalCache[cacheKey] = {
      data,
      timestamp: now,
      expiresAt: now + cacheDuration,
    };
    
    logDebug(`Datos guardados en caché: ${cacheKey}`, {
      expiresAt: new Date(now + cacheDuration).toISOString(),
      cacheDuration,
    });
  }, [cacheKey, cacheDuration, logDebug]);
  
  // Función para calcular el retraso con backoff exponencial
  const calculateRetryDelay = useCallback((attempt: number): number => {
    if (!retryBackoff) return retryDelay;
    
    // Fórmula de backoff exponencial: delay * 2^attempt
    const exponentialDelay = retryDelay * Math.pow(2, attempt);
    // Añadir un poco de aleatoriedad (jitter) para evitar tormentas de peticiones
    const jitter = Math.random() * 1000;
    return exponentialDelay + jitter;
  }, [retryDelay, retryBackoff]);
  
  // Función principal para cargar datos
  const fetchData = useCallback(async (forceRefresh = false): Promise<void> => {
    if (!isMounted.current) return;
    
    // Verificar si hay datos en caché y no se fuerza la actualización
    if (!forceRefresh) {
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData);
        setStatus("success");
        onSuccess?.(cachedData);
        return;
      }
    }
    
    setStatus("loading");
    
    try {
      logDebug(`Iniciando petición: ${cacheKey}`, { attempt: retries + 1 });
      const result = await fetchFn();
      
      if (isMounted.current) {
        setData(result);
        setStatus("success");
        setError(null);
        setRetries(0);
        saveToCache(result);
        onSuccess?.(result);
        
        logDebug(`Petición exitosa: ${cacheKey}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      logDebug(`Error en petición: ${cacheKey}`, { 
        message: error.message, 
        attempt: retries + 1 
      });
      
      if (isMounted.current) {
        setError(error);
        
        // Intentar de nuevo si no hemos alcanzado el límite de reintentos
        if (retries < retryCount) {
          const nextRetryDelay = calculateRetryDelay(retries);
          
          logDebug(`Reintentando en ${nextRetryDelay}ms: ${cacheKey}`, {
            attempt: retries + 1,
            maxRetries: retryCount,
          });
          
          setRetries((prev) => prev + 1);
          
          setTimeout(() => {
            if (isMounted.current) {
              fetchData(true);
            }
          }, nextRetryDelay);
        } else {
          setStatus("error");
          onError?.(error);
          
          logDebug(`Máximo de reintentos alcanzado: ${cacheKey}`);
        }
      }
    }
  }, [
    cacheKey, 
    fetchFn, 
    getFromCache, 
    saveToCache, 
    retries, 
    retryCount, 
    calculateRetryDelay, 
    onSuccess, 
    onError,
    logDebug
  ]);
  
  // Efecto para cargar datos inicialmente
  useEffect(() => {
    isMounted.current = true;
    fetchData();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);
  
  // Función para forzar una actualización
  const refetch = useCallback(() => {
    setRetries(0);
    return fetchData(true);
  }, [fetchData]);
  
  // Función para limpiar la caché
  const clearCache = useCallback(() => {
    delete globalCache[cacheKey];
    logDebug(`Caché limpiada: ${cacheKey}`);
  }, [cacheKey, logDebug]);
  
  return {
    data,
    status,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    refetch,
    clearCache,
  };
}
