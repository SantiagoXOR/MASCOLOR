"use client";

import { useState } from "react";
import { Brand } from "@/types";
import Image from "next/image";

interface BrandLogoDebugProps {
  brands: Brand[];
}

/**
 * Componente para depurar la visualización de logos de marcas
 */
export function BrandLogoDebug({ brands }: BrandLogoDebugProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-mascolor-primary text-white px-3 py-2 rounded-full text-xs shadow-lg"
      >
        {isOpen ? "Cerrar Debug" : "Debug Logos"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 max-w-md max-h-[80vh] overflow-auto">
          <h3 className="text-sm font-bold mb-2 text-mascolor-primary">
            Depuración de Logos de Marcas
          </h3>
          
          <div className="space-y-4">
            {brands.map((brand) => (
              <div key={brand.id} className="border-b pb-2">
                <h4 className="text-xs font-semibold">{brand.name}</h4>
                <div className="text-xs text-gray-600 mb-1">
                  <div>ID: {brand.id}</div>
                  <div>Slug: {brand.slug}</div>
                  <div>Logo URL: {brand.logo_url || "No definido"}</div>
                </div>
                
                <div className="flex space-x-4 mt-2">
                  <div className="border p-2 rounded bg-gray-100">
                    <p className="text-xs mb-1">Logo desde logo_url:</p>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      {brand.logo_url ? (
                        <Image
                          src={brand.logo_url}
                          alt={`Logo ${brand.name}`}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e) => {
                            const imgElement = e.currentTarget as HTMLImageElement;
                            imgElement.src = "/images/logos/placeholder.svg";
                          }}
                        />
                      ) : (
                        <span className="text-xs text-red-500">No URL</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="border p-2 rounded bg-gray-100">
                    <p className="text-xs mb-1">Logo desde slug:</p>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Image
                        src={`/images/logos/${brand.slug}.svg`}
                        alt={`Logo ${brand.name}`}
                        width={32}
                        height={32}
                        className="object-contain"
                        onError={(e) => {
                          const imgElement = e.currentTarget as HTMLImageElement;
                          imgElement.src = "/images/logos/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
