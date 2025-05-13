"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Tipo para el contexto de depuración vacío
interface EmptyDebugContextType {
  debugMode: string;
  isDebugEnabled: boolean;
  activeDebuggers: string[];
  setDebugMode: (mode: string) => void;
  toggleDebugger: (debuggerName: string) => void;
  enableDebugger: (debuggerName: string) => void;
  disableDebugger: (debuggerName: string) => void;
  disableAllDebuggers: () => void;
  logDebug: (message: string, data?: any) => void;
}

// Valor por defecto del contexto vacío
const defaultContext: EmptyDebugContextType = {
  debugMode: "disabled",
  isDebugEnabled: false,
  activeDebuggers: [],
  setDebugMode: () => {},
  toggleDebugger: () => {},
  enableDebugger: () => {},
  disableDebugger: () => {},
  disableAllDebuggers: () => {},
  logDebug: () => {},
};

// Crear el contexto
const EmptyDebugContext = createContext<EmptyDebugContextType>(defaultContext);

// Hook personalizado para usar el contexto
export const useDebug = () => useContext(EmptyDebugContext);

// Proveedor del contexto
export function DebugProvider({ children }: { children: ReactNode }) {
  return (
    <EmptyDebugContext.Provider value={defaultContext}>
      {children}
    </EmptyDebugContext.Provider>
  );
}
