"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Product } from "@/types";
import { useDebug } from "@/contexts/DebugContext";
import { useLogger } from "@/lib/services/LoggingService";
import { useProductsQuery } from "@/hooks/useQueryData";

// Tipo para el estado de una imagen
type ImageStatus = "loading" | "success" | "error";

// Tipo para el resultado de la verificación de imagen
interface ImageCheckResult {
  status: ImageStatus;
  errorMessage?: string;
  dimensions?: {
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  };
  alternativeFormat?: string;
  alternativeUrl?: string;
}

export function ProductImageDebug() {
  const { isDebugEnabled, activeDebuggers } = useDebug();
  const logger = useLogger("ProductImageDebug");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Usar React Query para obtener productos
  const { data: products = [], isLoading: loading, error } = useProductsQuery();

  // Referencia para controlar si el componente está montado
  const isMounted = useRef(true);

  // Función para verificar una imagen
  const checkImage = useCallback(
    async (imageUrl: string): Promise<ImageCheckResult> => {
      if (!imageUrl) {
        return {
          status: "error",
          errorMessage: "URL de imagen no proporcionada",
        };
      }

      logger.debug("Verificando imagen de producto", { url: imageUrl });

      // Verificar si la URL es válida
      if (
        !imageUrl.startsWith("http://") &&
        !imageUrl.startsWith("https://") &&
        !imageUrl.startsWith("/")
      ) {
        logger.warn("URL de imagen no normalizada", { url: imageUrl });
        imageUrl = "/" + imageUrl;
      }

      return new Promise((resolve) => {
        const img = new window.Image();

        img.onload = () => {
          logger.debug("Imagen cargada correctamente", {
            url: imageUrl,
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });
          img.onload = null;
          img.onerror = null;
          resolve({
            status: "success",
            dimensions: {
              width: img.width,
              height: img.height,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            },
          });
        };

        img.onerror = () => {
          logger.debug("Error al cargar imagen", { url: imageUrl });
          img.onload = null;
          img.onerror = null;

          // Intentar con diferentes formatos
          if (
            imageUrl.includes("/assets/images/products/") &&
            !imageUrl.endsWith(".webp") &&
            !imageUrl.endsWith(".avif")
          ) {
            logger.debug("Intentando con formato WebP", {
              url: imageUrl + "/original.webp",
            });
            const webpImg = new window.Image();
            webpImg.onload = () => {
              logger.debug("Imagen WebP cargada correctamente", {
                url: imageUrl + "/original.webp",
              });
              resolve({
                status: "success",
                alternativeFormat: "webp",
                alternativeUrl: imageUrl + "/original.webp",
              });
            };
            webpImg.onerror = () => {
              logger.debug("Error al cargar imagen WebP", {
                url: imageUrl + "/original.webp",
              });
              resolve({
                status: "error",
                errorMessage: "No se pudo cargar la imagen en ningún formato",
              });
            };
            webpImg.src = imageUrl + "/original.webp";
          } else {
            resolve({
              status: "error",
              errorMessage: "No se pudo cargar la imagen",
            });
          }
        };

        img.src = imageUrl;
      });
    },
    [logger]
  );

  // Usar React Query para verificar la imagen seleccionada
  const {
    data: imageCheckResult = { status: "loading" },
    isLoading: imageLoading,
  } = useQuery({
    queryKey: ["productImage", selectedProduct?.image_url],
    queryFn: () => checkImage(selectedProduct?.image_url || ""),
    enabled: !!selectedProduct?.image_url && isOpen,
    staleTime: 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
  });

  // Registrar estadísticas cuando cambian los productos
  const logProductStats = useCallback(() => {
    // Asegurarse de que products es un array
    const productsArray = Array.isArray(products)
      ? products
      : products && "data" in products
      ? products.data
      : [];

    if (productsArray.length > 0) {
      // Crear un objeto con las estadísticas
      const stats = {
        total: productsArray.length,
        withImages: productsArray.filter((p) => !!p.image_url).length,
        withoutImages: productsArray.filter((p) => !p.image_url).length,
        withAssetId: productsArray.filter((p) => !!p.asset_id).length,
      };

      // Usar el logger que ya está definido en el componente
      logger.info(
        `Estadísticas de imágenes de productos: Total: ${stats.total}, Con imágenes: ${stats.withImages}, Sin imágenes: ${stats.withoutImages}, Con asset_id: ${stats.withAssetId}`,
        stats
      );
    }
  }, [products]);

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("productImages")
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? "Cerrar Image Debug" : "Image Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Imágenes de Productos</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {Array.isArray(products)
                ? products.length
                : products && "data" in products
                ? products.data.length
                : 0}{" "}
              productos
            </span>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Estado:</h4>
            <div className="text-sm mt-1">
              {loading && (
                <div className="flex items-center text-blue-600">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Cargando productos...
                </div>
              )}
              {error && (
                <div className="flex items-center text-red-600">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Error: {(error as Error).message}
                </div>
              )}
              {!loading && !error && (
                <div className="flex items-center text-green-600">
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Productos cargados:{" "}
                  {Array.isArray(products)
                    ? products.length
                    : products && "data" in products
                    ? products.data.length
                    : 0}
                </div>
              )}
            </div>
          </div>

          {!loading && !error && (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">Seleccionar producto:</h4>
                  <button
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    onClick={logProductStats}
                  >
                    Ver estadísticas
                  </button>
                </div>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={selectedProduct?.id || ""}
                  onChange={(e) => {
                    const productsArray = Array.isArray(products)
                      ? products
                      : products && "data" in products
                      ? products.data
                      : [];
                    const selected = productsArray.find(
                      (p) => p.id === e.target.value
                    );
                    setSelectedProduct(selected || null);
                  }}
                >
                  <option value="">-- Seleccionar producto --</option>
                  {(Array.isArray(products)
                    ? products
                    : products && "data" in products
                    ? products.data
                    : []
                  ).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.brand?.name})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="border border-gray-200 rounded p-3 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{selectedProduct.name}</h4>
                    {selectedProduct.is_featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                        Destacado
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-xs font-medium text-gray-500">ID:</p>
                      <p className="text-xs font-mono">{selectedProduct.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Marca:
                      </p>
                      <p className="text-xs">
                        {selectedProduct.brand?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Categoría:
                      </p>
                      <p className="text-xs">
                        {selectedProduct.category?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Asset ID:
                      </p>
                      <p className="text-xs font-mono">
                        {selectedProduct.asset_id || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 bg-gray-50 p-2 rounded">
                    <p className="text-xs font-medium text-gray-500">
                      URL de imagen:
                    </p>
                    <p className="text-xs break-all font-mono">
                      {selectedProduct.image_url || "N/A"}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Rutas alternativas:
                    </p>
                    <div className="text-xs">
                      {selectedProduct.asset_id ? (
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded mr-1">
                              WebP
                            </span>
                            <p className="text-xs break-all font-mono">
                              /assets/images/products/{selectedProduct.asset_id}
                              /original.webp
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded mr-1">
                              AVIF
                            </span>
                            <p className="text-xs break-all font-mono">
                              /assets/images/products/{selectedProduct.asset_id}
                              /original.avif
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-red-500 bg-red-50 p-2 rounded flex items-center">
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
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          No hay asset_id disponible
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative h-40 bg-gray-100 rounded mb-3">
                    {selectedProduct.image_url ? (
                      <OptimizedImage
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        fallbackSrc="/images/products/placeholder.jpg"
                        fill
                        sizes="300px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">Sin imagen</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-2 rounded bg-gray-50">
                    <div className="flex items-center mb-2">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          imageCheckResult.status === "success"
                            ? "bg-green-500"
                            : imageCheckResult.status === "error"
                            ? "bg-red-500"
                            : "bg-yellow-500 animate-pulse"
                        }`}
                      ></span>
                      <p className="text-xs">
                        {imageLoading && "Verificando imagen..."}
                        {imageCheckResult.status === "success" &&
                          "Imagen cargada correctamente"}
                        {imageCheckResult.status === "error" &&
                          (imageCheckResult.errorMessage ||
                            "Error al cargar la imagen")}
                      </p>
                    </div>

                    {imageCheckResult.status === "success" &&
                      imageCheckResult.dimensions && (
                        <div className="text-xs mt-1 grid grid-cols-2 gap-1 bg-white p-1 rounded">
                          <div>
                            <span className="font-medium">Dimensiones:</span>{" "}
                            {imageCheckResult.dimensions.width}x
                            {imageCheckResult.dimensions.height}
                          </div>
                          <div>
                            <span className="font-medium">Natural:</span>{" "}
                            {imageCheckResult.dimensions.naturalWidth}x
                            {imageCheckResult.dimensions.naturalHeight}
                          </div>
                        </div>
                      )}

                    {imageCheckResult.status === "success" &&
                      imageCheckResult.alternativeFormat && (
                        <div className="text-xs mt-1 bg-blue-50 p-1 rounded">
                          <span className="font-medium">
                            Formato alternativo:
                          </span>{" "}
                          {imageCheckResult.alternativeFormat.toUpperCase()}
                          <p className="text-xs break-all font-mono mt-1">
                            {imageCheckResult.alternativeUrl}
                          </p>
                        </div>
                      )}

                    {/* Botón para probar formatos alternativos */}
                    {selectedProduct?.image_url && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <button
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          onClick={() => {
                            if (selectedProduct.asset_id) {
                              const webpUrl = `/assets/images/products/${selectedProduct.asset_id}/original.webp`;
                              logger.debug("Probando formato WebP", {
                                url: webpUrl,
                              });
                              const img = new window.Image();
                              img.onload = () =>
                                logger.info("WebP cargado correctamente", {
                                  url: webpUrl,
                                });
                              img.onerror = () =>
                                logger.error("Error al cargar WebP", {
                                  url: webpUrl,
                                });
                              img.src = webpUrl;
                            }
                          }}
                        >
                          Probar WebP
                        </button>
                        <button
                          className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                          onClick={() => {
                            if (selectedProduct.asset_id) {
                              const avifUrl = `/assets/images/products/${selectedProduct.asset_id}/original.avif`;
                              logger.debug("Probando formato AVIF", {
                                url: avifUrl,
                              });
                              const img = new window.Image();
                              img.onload = () =>
                                logger.info("AVIF cargado correctamente", {
                                  url: avifUrl,
                                });
                              img.onerror = () =>
                                logger.error("Error al cargar AVIF", {
                                  url: avifUrl,
                                });
                              img.src = avifUrl;
                            }
                          }}
                        >
                          Probar AVIF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Nota: Esta herramienta ayuda a depurar problemas con las imágenes
              de productos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
