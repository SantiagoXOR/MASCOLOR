"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebug } from "@/contexts/DebugContext";
import { X, Settings, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";

// Lista de depuradores disponibles
const availableDebuggers = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Conexión y datos de Supabase",
  },
  {
    id: "supabaseClient",
    name: "Supabase Client",
    description: "Cliente de Supabase en el navegador",
  },
  { id: "images", name: "Images", description: "Verificación de imágenes" },
  { id: "products", name: "Products", description: "Información de productos" },
  {
    id: "productImages",
    name: "Product Images",
    description: "Imágenes de productos",
  },
  { id: "routes", name: "Routes", description: "Navegación y rutas" },
];

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"debuggers" | "settings" | "info">(
    "debuggers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showTooltips, setShowTooltips] = useState(true);

  const {
    debugMode,
    activeDebuggers,
    setDebugMode,
    toggleDebugger,
    enableDebugger,
    disableDebugger,
    disableAllDebuggers,
    logDebug,
  } = useDebug();

  // Efecto para cerrar el panel cuando se cambia a producción
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setIsOpen(false);
    }
  }, []);

  // Método para alternar el modo de depuración
  const toggleDebugMode = useCallback(() => {
    if (debugMode === "disabled") {
      setDebugMode("minimal");
      logDebug("Modo de depuración cambiado a 'minimal'");
    } else if (debugMode === "minimal") {
      setDebugMode("detailed");
      logDebug("Modo de depuración cambiado a 'detailed'");
    } else {
      setDebugMode("disabled");
      logDebug("Modo de depuración desactivado");
    }
  }, [debugMode, setDebugMode, logDebug]);

  // Filtrar depuradores por búsqueda
  const filteredDebuggers = useMemo(() => {
    if (!searchQuery) return availableDebuggers;

    return availableDebuggers.filter(
      (debug) =>
        debug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        debug.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Activar todos los depuradores
  const enableAllDebuggers = useCallback(() => {
    availableDebuggers.forEach((debug) => {
      enableDebugger(debug.id);
    });
    logDebug("Todos los depuradores activados");
  }, [enableDebugger, logDebug]);

  // No renderizar en producción
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        aria-label={
          isOpen ? "Cerrar panel de depuración" : "Abrir panel de depuración"
        }
      >
        {isOpen ? <X size={20} /> : <Settings size={20} />}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-80 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Panel de Depuración</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                aria-label={isExpanded ? "Contraer panel" : "Expandir panel"}
              >
                {isExpanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Modo de depuración:</h4>
              <button
                onClick={toggleDebugMode}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  debugMode === "disabled"
                    ? "bg-gray-200 text-gray-700"
                    : debugMode === "minimal"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {debugMode === "disabled"
                  ? "Deshabilitado"
                  : debugMode === "minimal"
                  ? "Mínimo"
                  : "Detallado"}
              </button>
            </div>
          </div>

          {debugMode !== "disabled" && isExpanded && (
            <>
              {/* Pestañas de navegación */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab("debuggers")}
                  className={`py-2 px-3 text-sm font-medium ${
                    activeTab === "debuggers"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Depuradores
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-2 px-3 text-sm font-medium ${
                    activeTab === "settings"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Configuración
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`py-2 px-3 text-sm font-medium ${
                    activeTab === "info"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Info
                </button>
              </div>

              {/* Contenido de la pestaña Depuradores */}
              {activeTab === "debuggers" && (
                <>
                  <div className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar depuradores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-8 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <svg
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">
                        Depuradores disponibles:
                      </h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={enableAllDebuggers}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                        >
                          Activar todos
                        </button>
                        <button
                          onClick={disableAllDebuggers}
                          className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                        >
                          Desactivar todos
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {filteredDebuggers.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          No se encontraron depuradores
                        </p>
                      ) : (
                        filteredDebuggers.map((debug) => (
                          <div
                            key={debug.id}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">
                                  {debug.name}
                                </span>
                                {showTooltips && (
                                  <div className="relative group ml-1">
                                    <span className="cursor-help text-gray-400 text-xs">
                                      ℹ️
                                    </span>
                                    <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      {debug.description}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {!showTooltips && (
                                <p className="text-xs text-gray-500">
                                  {debug.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleDebugger(debug.id)}
                              className={`p-1.5 rounded ${
                                activeDebuggers.includes(debug.id)
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                              aria-label={
                                activeDebuggers.includes(debug.id)
                                  ? `Deshabilitar ${debug.name}`
                                  : `Habilitar ${debug.name}`
                              }
                            >
                              {activeDebuggers.includes(debug.id) ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Contenido de la pestaña Configuración */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      Opciones de visualización:
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={showTooltips}
                          onChange={() => setShowTooltips(!showTooltips)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Mostrar descripciones como tooltips</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Acciones:</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          logDebug("Consola limpiada por el usuario");
                          console.clear();
                        }}
                        className="w-full py-1.5 px-3 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                        Limpiar consola
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido de la pestaña Info */}
              {activeTab === "info" && (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1">Entorno:</h4>
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <p>
                        Modo:{" "}
                        <span className="font-mono">
                          {process.env.NODE_ENV}
                        </span>
                      </p>
                      <p>
                        Next.js: <span className="font-mono">15.x</span>
                      </p>
                      <p>
                        React: <span className="font-mono">18.x</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Depuradores activos:</h4>
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      {activeDebuggers.length === 0 ? (
                        <p className="text-gray-500 italic">Ninguno activo</p>
                      ) : (
                        <ul className="list-disc pl-5 space-y-1">
                          {activeDebuggers.map((id) => {
                            const debug = availableDebuggers.find(
                              (d) => d.id === id
                            );
                            return <li key={id}>{debug?.name || id}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Ayuda:</h4>
                    <p className="text-xs text-gray-600">
                      Este panel permite controlar los componentes de depuración
                      de la aplicación. Activa o desactiva los depuradores según
                      sea necesario para visualizar información específica
                      durante el desarrollo.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-4 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Modo: {debugMode} | Activos: {activeDebuggers.length}
              </p>
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
