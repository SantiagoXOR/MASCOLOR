"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { logger, LogMode } from "@/lib/services/LoggingService";
import { throttle } from "@/lib/utils/throttle";

// Tipos para el contexto de depuración
type DebugMode = "disabled" | "minimal" | "detailed";

interface DebugContextType {
  // Estado global
  debugMode: DebugMode;
  isDebugEnabled: boolean;
  activeDebuggers: string[];

  // Métodos para controlar el estado
  setDebugMode: (mode: DebugMode) => void;
  toggleDebugger: (debuggerName: string) => void;
  enableDebugger: (debuggerName: string) => void;
  disableDebugger: (debuggerName: string) => void;
  disableAllDebuggers: () => void;

  // Métodos para logging
  logDebug: (message: string, data?: any) => void;
}

// Valor por defecto del contexto
const defaultContext: DebugContextType = {
  debugMode: process.env.NODE_ENV === "production" ? "disabled" : "minimal",
  isDebugEnabled: process.env.NODE_ENV !== "production",
  activeDebuggers: [],

  setDebugMode: () => {},
  toggleDebugger: () => {},
  enableDebugger: () => {},
  disableDebugger: () => {},
  disableAllDebuggers: () => {},

  logDebug: () => {},
};

// Crear el contexto
const DebugContext = createContext<DebugContextType>(defaultContext);

// Hook personalizado para usar el contexto
export const useDebug = () => useContext(DebugContext);

// Proveedor del contexto
export function DebugProvider({ children }: { children: ReactNode }) {
  // Estado para el modo de depuración
  const [debugMode, setDebugModeState] = useState<DebugMode>(
    process.env.NODE_ENV === "production" ? "disabled" : "minimal"
  );

  // Estado para los depuradores activos
  const [activeDebuggers, setActiveDebuggers] = useState<string[]>([
    "products",
    "productImages",
    "images",
    "supabase",
  ]);

  // Calcular si la depuración está habilitada
  const isDebugEnabled = debugMode !== "disabled";

  // Configurar el servicio de registro cuando cambia el modo
  useEffect(() => {
    // Configurar el servicio de registro
    logger.setEnabled(isDebugEnabled);
    logger.setMode(debugMode === "detailed" ? "detailed" : "minimal");

    // Registrar el cambio de modo
    if (isDebugEnabled) {
      logger.info("DebugContext", `Modo de depuración: ${debugMode}`);
    }
  }, [debugMode, isDebugEnabled]);

  // Método para cambiar el modo de depuración
  const setDebugMode = useCallback((mode: DebugMode) => {
    setDebugModeState(mode);

    // Si se deshabilita, limpiar los depuradores activos
    if (mode === "disabled") {
      setActiveDebuggers([]);
    }
  }, []);

  // Método para alternar un depurador con throttling
  const toggleDebugger = useCallback(
    throttle((debuggerName: string) => {
      setActiveDebuggers((prev) => {
        const isActive = prev.includes(debuggerName);
        const newState = isActive
          ? prev.filter((name) => name !== debuggerName)
          : [...prev, debuggerName];

        // Registrar el cambio
        logger.debug(
          "DebugContext",
          `Depurador ${debuggerName} ${isActive ? "desactivado" : "activado"}`
        );

        return newState;
      });
    }, 300),
    []
  );

  // Método para habilitar un depurador
  const enableDebugger = useCallback((debuggerName: string) => {
    setActiveDebuggers((prev) => {
      if (prev.includes(debuggerName)) return prev;

      // Registrar el cambio
      logger.debug("DebugContext", `Depurador ${debuggerName} activado`);

      return [...prev, debuggerName];
    });
  }, []);

  // Método para deshabilitar un depurador
  const disableDebugger = useCallback((debuggerName: string) => {
    setActiveDebuggers((prev) => {
      if (!prev.includes(debuggerName)) return prev;

      // Registrar el cambio
      logger.debug("DebugContext", `Depurador ${debuggerName} desactivado`);

      return prev.filter((name) => name !== debuggerName);
    });
  }, []);

  // Método para deshabilitar todos los depuradores
  const disableAllDebuggers = useCallback(() => {
    setActiveDebuggers([]);
    logger.debug("DebugContext", "Todos los depuradores desactivados");
  }, []);

  // Método para logging con throttling para evitar actualizaciones excesivas
  const logDebug = useCallback(
    throttle((message: string, data?: any) => {
      if (isDebugEnabled) {
        logger.debug("DebugContext", message, data);
      }
    }, 100),
    [isDebugEnabled]
  );

  // Valor del contexto
  const contextValue: DebugContextType = {
    debugMode,
    isDebugEnabled,
    activeDebuggers,

    setDebugMode,
    toggleDebugger,
    enableDebugger,
    disableDebugger,
    disableAllDebuggers,

    logDebug,
  };

  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
}
