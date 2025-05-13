"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebug } from "@/contexts/DebugContext";

export function RouteDebug() {
  const { isDebugEnabled, activeDebuggers, logDebug } = useDebug();
  const [isOpen, setIsOpen] = useState(false);
  const [routeHistory, setRouteHistory] = useState<Array<{
    pathname: string;
    search: string;
    timestamp: number;
  }>>([]);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Registrar cambios de ruta
  useEffect(() => {
    if (!isDebugEnabled || !activeDebuggers.includes("routes")) return;
    
    const search = searchParams ? `?${searchParams.toString()}` : "";
    const newRoute = {
      pathname,
      search,
      timestamp: Date.now()
    };
    
    setRouteHistory(prev => {
      // Limitar el historial a las últimas 10 rutas
      const newHistory = [newRoute, ...prev].slice(0, 10);
      return newHistory;
    });
    
    logDebug("Cambio de ruta", {
      pathname,
      search,
      timestamp: new Date().toISOString()
    });
  }, [pathname, searchParams, isDebugEnabled, activeDebuggers, logDebug]);
  
  // No renderizar si no está habilitado el depurador o estamos en producción
  if (process.env.NODE_ENV === "production" || !isDebugEnabled || !activeDebuggers.includes("routes")) {
    return null;
  }
  
  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isOpen ? "Cerrar Route Debug" : "Route Debug"}
      </button>
      
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Depuración de Rutas</h3>
            <button
              onClick={() => setRouteHistory([])}
              className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
            >
              Limpiar historial
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold">Ruta actual:</h4>
            <div className="bg-indigo-50 p-2 rounded mt-1">
              <p className="text-sm font-mono break-all">{pathname}</p>
              {searchParams && searchParams.toString() && (
                <p className="text-sm font-mono text-indigo-600 break-all">
                  ?{searchParams.toString()}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Historial de rutas:</h4>
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {routeHistory.length} entradas
              </span>
            </div>
            
            {routeHistory.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay historial de rutas</p>
            ) : (
              <div className="space-y-2">
                {routeHistory.map((route, index) => (
                  <div 
                    key={`${route.pathname}-${route.timestamp}`}
                    className={`border rounded p-2 ${index === 0 ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-mono break-all">{route.pathname}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(route.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {route.search && (
                      <p className="text-xs font-mono text-indigo-600 break-all mt-1">
                        {route.search}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-200">
            <h4 className="font-semibold mb-1">Parámetros de búsqueda:</h4>
            {searchParams && searchParams.toString() ? (
              <div className="bg-gray-50 p-2 rounded">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left font-medium text-gray-500">Clave</th>
                      <th className="text-left font-medium text-gray-500">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(searchParams.entries()).map(([key, value]) => (
                      <tr key={key} className="border-t border-gray-100">
                        <td className="py-1 font-mono">{key}</td>
                        <td className="py-1 font-mono break-all">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No hay parámetros de búsqueda</p>
            )}
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Nota: Esta herramienta registra los cambios de ruta en la aplicación.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
