"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import NextImage from "next/image";
import { useDebug } from "@/contexts/DebugContext";
import { useLogger } from "@/lib/services/LoggingService";
import { throttle } from "@/lib/utils/throttle";

interface ImageDebugProps {
  imagePaths?: string[];
}

// Tipo para el estado de una imagen
type ImageStatus = "loading" | "success" | "error";

// Tipo para el resultado de la verificación de imágenes
interface ImageCheckResult {
  status: ImageStatus;
  imageStatuses: Record<string, ImageStatus>;
  imageDimensions?: Record<
    string,
    {
      width: number;
      height: number;
      naturalWidth: number;
      naturalHeight: number;
    }
  >;
  errorMessage?: string;
}

export function ImageDebug({ imagePaths = [] }: ImageDebugProps) {
  // Usar el contexto de depuración
  const { isDebugEnabled, activeDebuggers } = useDebug();
  const logger = useLogger("ImageDebug");

  const [isOpen, setIsOpen] = useState(false);

  // Rutas de imágenes predefinidas para probar
  const defaultImagePaths = useMemo(
    () => [
      "/images/products/placeholder.jpg",
      "/assets/images/products/c323bdbab05d7c2db5e0517bea8a94be/original.webp", // Microcemento Facilfix
      "/assets/images/products/f3c5a1a4ba55fb4e5c0d6a08d821d3da/original.webp", // Barniz Marino Newhouse
    ],
    []
  );

  // Combinar rutas predefinidas con las proporcionadas usando useMemo
  const allImagePaths = useMemo(() => {
    // Crear un array combinado y eliminar duplicados con Array.from en lugar de usar el operador spread con Set
    const combinedPaths = [...defaultImagePaths, ...imagePaths];
    return Array.from(new Set(combinedPaths));
  }, [defaultImagePaths, imagePaths]);

  // Referencia para controlar si el componente está montado
  const isMounted = useRef(true);

  // Función para verificar imágenes por lotes
  const checkImages = useCallback(async (): Promise<ImageCheckResult> => {
    if (!isOpen) {
      return {
        status: "loading",
        imageStatuses: {},
      };
    }

    logger.debug("Iniciando verificación de imágenes", {
      count: allImagePaths.length,
    });

    // Inicializar el estado de las imágenes
    const imageStatuses: Record<string, ImageStatus> = {};
    const imageDimensions: Record<
      string,
      {
        width: number;
        height: number;
        naturalWidth: number;
        naturalHeight: number;
      }
    > = {};

    allImagePaths.forEach((path) => {
      imageStatuses[path] = "loading";
    });

    // Función para verificar una imagen
    const checkImage = (imagePath: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image();

        const onLoad = () => {
          imageStatuses[imagePath] = "success";
          // Guardar las dimensiones de la imagen
          imageDimensions[imagePath] = {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          };

          logger.debug(`Imagen cargada: ${imagePath}`, {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });

          img.onload = null;
          img.onerror = null;
          resolve();
        };

        const onError = () => {
          imageStatuses[imagePath] = "error";
          logger.debug(`Error al cargar imagen: ${imagePath}`);
          img.onload = null;
          img.onerror = null;
          resolve();
        };

        img.onload = onLoad;
        img.onerror = onError;
        img.src = imagePath;
      });
    };

    // Procesar imágenes por lotes para evitar sobrecarga
    const batchSize = 3;
    const batches = Math.ceil(allImagePaths.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, allImagePaths.length);
      const batchPaths = allImagePaths.slice(start, end);

      logger.debug(`Procesando lote ${i + 1}/${batches}`, {
        paths: batchPaths,
      });

      // Procesar cada lote en paralelo
      await Promise.all(batchPaths.map(checkImage));

      // Pequeña pausa entre lotes
      if (i < batches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    logger.debug("Verificación de imágenes completada", {
      success: Object.values(imageStatuses).filter((s) => s === "success")
        .length,
      error: Object.values(imageStatuses).filter((s) => s === "error").length,
    });

    return {
      status: "success",
      imageStatuses,
      imageDimensions,
    };
  }, [isOpen, allImagePaths, logger]);

  // Usar React Query para gestionar el estado y la caché
  const {
    data = { status: "loading", imageStatuses: {} },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["imageDebug", { paths: allImagePaths, isOpen }],
    queryFn: checkImages,
    enabled: isOpen && isDebugEnabled && activeDebuggers.includes("images"),
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: false,
  });

  // Extraer datos del resultado
  const { status, imageStatuses, imageDimensions } = data;
  const errorMessage = error ? (error as Error).message : undefined;

  // No renderizar si no está habilitado el depurador o estamos en producción
  if (
    process.env.NODE_ENV === "production" ||
    !isDebugEnabled ||
    !activeDebuggers.includes("images")
  ) {
    return null;
  }

  // Renderizar el componente de depuración
  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-yellow-700 transition-colors"
      >
        {isOpen ? "Cerrar Image Debug" : "Image Debug"}
      </button>

      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 w-96 max-h-[80vh] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Depuración de Imágenes</h3>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {allImagePaths.length} imágenes
            </span>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold">Estado:</h4>
            <div className="text-sm">
              {isLoading && (
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
                  Verificando imágenes...
                </div>
              )}
              {status === "success" && (
                <p className="text-green-600 flex items-center">
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
                  Verificación completada
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 flex items-center">
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Error: {errorMessage}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-1">Imágenes verificadas:</h4>
            <div className="text-sm border border-gray-200 rounded p-2 max-h-64 overflow-auto">
              {allImagePaths.map((imagePath, index) => (
                <div key={index} className="mb-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center mb-1">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        imageStatuses[imagePath] === "success"
                          ? "bg-green-500"
                          : imageStatuses[imagePath] === "error"
                          ? "bg-red-500"
                          : "bg-yellow-500 animate-pulse"
                      }`}
                    ></span>
                    <p className="text-xs font-medium truncate">{imagePath}</p>
                  </div>

                  {imageStatuses[imagePath] === "success" && (
                    <>
                      <div className="relative h-20 bg-gray-100 rounded mb-1">
                        <NextImage
                          src={imagePath}
                          alt="Preview"
                          className="h-full mx-auto object-contain"
                          width={100}
                          height={80}
                        />
                      </div>
                      {imageDimensions && imageDimensions[imagePath] && (
                        <div className="text-xs grid grid-cols-2 gap-1 bg-gray-50 p-1 rounded">
                          <div>
                            <span className="font-medium">Dimensiones:</span>{" "}
                            {imageDimensions[imagePath].width}x
                            {imageDimensions[imagePath].height}
                          </div>
                          <div>
                            <span className="font-medium">Natural:</span>{" "}
                            {imageDimensions[imagePath].naturalWidth}x
                            {imageDimensions[imagePath].naturalHeight}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {imageStatuses[imagePath] === "error" && (
                    <p className="text-xs text-red-500">
                      No se pudo cargar la imagen
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Nota: Esta herramienta solo verifica si las imágenes pueden
              cargarse en el navegador.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
