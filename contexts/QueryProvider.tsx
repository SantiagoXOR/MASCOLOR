"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { logger } from "@/lib/services/LoggingService";

// Crear un cliente de consulta con opciones personalizadas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Opciones globales para todas las consultas
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
      refetchOnReconnect: true,
    },
  },
  // La propiedad logger no es parte de QueryClientConfig en versiones recientes
  // Configuramos los eventos manualmente
});

/**
 * Proveedor para React Query
 * @param children Componentes hijos
 * @returns Componente proveedor
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Exportar el cliente de consulta para uso directo
export { queryClient };
