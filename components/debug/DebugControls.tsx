"use client";

import { useState } from "react";
import { useDebug } from "@/contexts/DebugContext";
import { logger } from "@/lib/services/LoggingService";

/**
 * Componente para controlar las opciones de depuración
 */
export function DebugControls() {
  const {
    debugMode,
    isDebugEnabled,
    activeDebuggers,
    setDebugMode,
    toggleDebugger,
    disableAllDebuggers,
  } = useDebug();

  const [isOpen, setIsOpen] = useState(false);

  // Lista de depuradores disponibles
  const availableDebuggers = [
    { id: "images", name: "Imágenes" },
    { id: "productImages", name: "Imágenes de Productos" },
    { id: "products", name: "Productos" },
    { id: "api", name: "API" },
    { id: "routes", name: "Rutas" },
    { id: "state", name: "Estado" },
  ];

  // No renderizar en producción
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-mascolor-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-mascolor-primary-dark transition-colors"
      >
        {isOpen ? "Cerrar Debug" : "Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Opciones de Depuración</h3>
            <span
              className={`px-2 py-1 rounded text-xs ${
                isDebugEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isDebugEnabled ? "Activado" : "Desactivado"}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Modo:</label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded text-sm ${
                  debugMode === "disabled"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setDebugMode("disabled")}
              >
                Desactivado
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${
                  debugMode === "minimal"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setDebugMode("minimal")}
              >
                Mínimo
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${
                  debugMode === "detailed"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => setDebugMode("detailed")}
              >
                Detallado
              </button>
            </div>
          </div>

          {isDebugEnabled && (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">
                    Depuradores:
                  </label>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={disableAllDebuggers}
                  >
                    Desactivar todos
                  </button>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {availableDebuggers.map((debugItem) => (
                    <div
                      key={debugItem.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{debugItem.name}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          activeDebuggers.includes(debugItem.id)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => toggleDebugger(debugItem.id)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            activeDebuggers.includes(debugItem.id)
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    onClick={() => {
                      logger.info(
                        "DebugControls",
                        "Logs limpiados manualmente",
                        {
                          action: "clear_logs",
                        }
                      );
                      logger.clearLogs();
                    }}
                  >
                    Limpiar logs
                  </button>
                  <button
                    className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                    onClick={() => {
                      logger.info("DebugControls", "Test log", {
                        test: true,
                        time: Date.now(),
                      });
                    }}
                  >
                    Log de prueba
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
