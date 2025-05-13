"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
  usePlaceholder?: boolean;
  useBlur?: boolean;
  artDirectionSources?: {
    media: string;
    srcSet: string;
  }[];
}

/**
 * Componente OptimizedImage mejorado que extiende el componente Image de Next.js
 * con características adicionales como:
 * - Carga progresiva con placeholders
 * - Soporte para formatos modernos (WebP, AVIF)
 * - Manejo de errores con imagen de respaldo
 * - Efectos de transición personalizables
 * - Art direction para diferentes dispositivos
 */
// Función para registrar información de depuración
const logImageDebug = (message: string, data: Record<string, any> = {}) => {
  console.log(
    "%c[OptimizedImage Debug]%c " + message,
    "background: #870064; color: white; padding: 2px 4px; border-radius: 2px;",
    "color: #870064; font-weight: bold;",
    data
  );
};

export function OptimizedImage({
  src,
  fallbackSrc = "/images/products/placeholder.jpg",
  alt,
  className,
  containerClassName,
  loadingClassName,
  usePlaceholder = false,
  useBlur = false,
  artDirectionSources = [],
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  // Determinar si hay un placeholder disponible
  const hasPlaceholder = false;

  // Normalizar la URL de la imagen
  let normalizedSrc = src;

  // Si la URL no comienza con http:// o https:// o /, añadir /
  if (
    normalizedSrc &&
    !normalizedSrc.startsWith("http://") &&
    !normalizedSrc.startsWith("https://") &&
    !normalizedSrc.startsWith("/")
  ) {
    normalizedSrc = "/" + normalizedSrc;
    logImageDebug("URL de imagen normalizada", {
      original: src,
      normalized: normalizedSrc,
    });
  }

  // Verificar si la ruta es para un asset optimizado
  const isAssetPath = normalizedSrc.includes("/assets/images/products/");

  // Generar rutas para formatos modernos
  let webpSrc = normalizedSrc;
  let avifSrc = normalizedSrc;
  let jpgSrc = normalizedSrc;
  let pngSrc = normalizedSrc;

  if (isAssetPath) {
    // Para rutas de assets optimizados
    // Verificar si la ruta ya incluye el formato
    if (
      normalizedSrc.endsWith(".webp") ||
      normalizedSrc.endsWith(".avif") ||
      normalizedSrc.endsWith(".jpg") ||
      normalizedSrc.endsWith(".png")
    ) {
      // La ruta ya incluye el formato, solo cambiar la extensión
      const basePath = normalizedSrc.substring(
        0,
        normalizedSrc.lastIndexOf(".")
      );
      webpSrc = `${basePath}.webp`;
      avifSrc = `${basePath}.avif`;
      jpgSrc = `${basePath}.jpg`;
      pngSrc = `${basePath}.png`;
    } else {
      // La ruta no incluye el formato, agregar /original.formato
      const assetPath = normalizedSrc.endsWith("/")
        ? normalizedSrc
        : normalizedSrc + "/";
      webpSrc = `${assetPath}original.webp`;
      avifSrc = `${assetPath}original.avif`;
      jpgSrc = `${assetPath}original.jpg`;
      pngSrc = `${assetPath}original.png`;

      // Actualizar la URL original para que apunte directamente al WebP
      normalizedSrc = webpSrc;

      logImageDebug("URL de asset actualizada a WebP", {
        original: src,
        normalized: normalizedSrc,
        webp: webpSrc,
      });
    }
  } else {
    // Para rutas antiguas
    const srcWithoutExt = normalizedSrc.substring(
      0,
      normalizedSrc.lastIndexOf(".") !== -1
        ? normalizedSrc.lastIndexOf(".")
        : normalizedSrc.length
    );
    const srcPath = srcWithoutExt.substring(
      0,
      srcWithoutExt.lastIndexOf("/") !== -1
        ? srcWithoutExt.lastIndexOf("/") + 1
        : 0
    );
    const srcFile = srcWithoutExt.substring(
      srcWithoutExt.lastIndexOf("/") !== -1
        ? srcWithoutExt.lastIndexOf("/") + 1
        : 0
    );

    // Crear versiones en minúsculas y mayúsculas para mayor compatibilidad
    const lowerSrcFile = srcFile.toLowerCase();

    // Generar rutas para formatos modernos
    webpSrc = `${srcPath}${lowerSrcFile}.webp`;
    avifSrc = `${srcPath}${lowerSrcFile}.avif`;
    jpgSrc = `${srcPath}${lowerSrcFile}.jpg`;
    pngSrc = `${srcPath}${lowerSrcFile}.png`;
  }

  // Actualizar la URL de origen si es una ruta de asset
  if (
    isAssetPath &&
    !src.endsWith(".webp") &&
    !src.endsWith(".avif") &&
    !src.endsWith(".jpg") &&
    !src.endsWith(".png")
  ) {
    src = normalizedSrc;
  }

  // Función para intentar cargar la imagen con diferentes formatos
  // Optimizada para reducir intentos y mejorar rendimiento
  const tryLoadImage = useCallback(
    (currentSrc: string, attempt: number = 0) => {
      // Solo registrar en desarrollo para evitar sobrecarga de console.log
      if (process.env.NODE_ENV === "development") {
        logImageDebug(`Intento ${attempt + 1} de cargar imagen`, {
          src: currentSrc,
          attempt: attempt + 1,
          isAssetPath: currentSrc.includes("/assets/images/products/"),
        });
      }

      // Verificar si la URL es válida
      if (!currentSrc || currentSrc === "") {
        if (process.env.NODE_ENV === "development") {
          logImageDebug(`⚠️ URL de imagen inválida, usando fallback`, {
            fallbackSrc,
          });
        }
        setImgSrc(fallbackSrc);
        setError(true);
        setIsLoading(false);
        return;
      }

      // Asegurarse de que window esté definido (solo en el cliente)
      if (typeof window !== "undefined") {
        const img = new window.Image();

        // Función optimizada para intentar con el siguiente formato
        // Reducimos la cantidad de intentos para mejorar rendimiento
        const tryNextFormat = (currentAttempt: number) => {
          // Intentar con diferentes formatos según el intento actual
          // Priorizar WebP y JPG que son los formatos más compatibles y eficientes
          if (currentAttempt === 0 && isAssetPath) {
            // Si es una ruta de asset, intentar directamente con WebP
            if (process.env.NODE_ENV === "development") {
              logImageDebug("Intentando con formato WebP", { src: webpSrc });
            }
            tryLoadImage(webpSrc, 1);
          } else if (currentAttempt === 1) {
            // Segundo intento, probar con JPG (saltamos AVIF para reducir intentos)
            if (process.env.NODE_ENV === "development") {
              logImageDebug("Intentando con formato JPG", { src: jpgSrc });
            }
            tryLoadImage(jpgSrc, 2);
          } else if (currentAttempt === 2 && isAssetPath) {
            // Tercer intento para assets, probar con placeholder
            const assetId = currentSrc.match(
              /\/assets\/images\/products\/([^\/]+)/
            )?.[1];
            if (assetId) {
              const placeholderSrc = `/assets/images/products/${assetId}/placeholder.webp`;
              if (process.env.NODE_ENV === "development") {
                logImageDebug("Intentando con placeholder", {
                  src: placeholderSrc,
                });
              }
              tryLoadImage(placeholderSrc, 3);
            } else {
              handleDefaultFallback();
            }
          } else {
            handleDefaultFallback();
          }
        };

        // Función para usar el fallback por defecto
        const handleDefaultFallback = () => {
          logImageDebug(`⚠️ Todos los intentos fallaron, usando fallback`, {
            fallbackSrc,
          });
          setImgSrc(fallbackSrc);
          setError(true);
          setIsLoading(false);
        };

        // Establecer un tiempo de espera para la carga (reducido para mejorar rendimiento)
        const timeout = setTimeout(() => {
          if (!img.complete) {
            if (process.env.NODE_ENV === "development") {
              logImageDebug(`⏱️ Tiempo de espera agotado`, { src: currentSrc });
            }
            img.src = ""; // Cancelar la carga
            tryNextFormat(attempt);
          }
        }, 2000); // 2 segundos de tiempo de espera (reducido de 3s)

        // Configurar los manejadores antes de establecer src
        img.onload = () => {
          clearTimeout(timeout);
          img.onload = null;
          img.onerror = null;

          logImageDebug(`✅ Imagen cargada correctamente`, {
            src: currentSrc,
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
          });

          // Verificar si la imagen tiene dimensiones válidas
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            if (process.env.NODE_ENV === "development") {
              logImageDebug(
                `⚠️ Imagen cargada pero con dimensiones inválidas`,
                {
                  src: currentSrc,
                }
              );
            }

            // Intentar con el siguiente formato (reducido el número máximo de intentos)
            if (attempt < 3) {
              // Reducido de 6 a 3 intentos máximos
              tryNextFormat(attempt);
              return;
            }
          }

          setImgSrc(currentSrc);
          setIsLoading(false);
          setError(false);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          img.onload = null;
          img.onerror = null;

          logImageDebug(`❌ Error al cargar imagen`, { src: currentSrc });
          tryNextFormat(attempt);
        };

        // Iniciar la carga
        img.src = currentSrc;
      }
    },
    [alt, avifSrc, fallbackSrc, isAssetPath, jpgSrc, pngSrc, src, webpSrc]
  );

  // Efecto para cargar la imagen
  useEffect(() => {
    logImageDebug("Iniciando carga de imagen", {
      src,
      isAssetPath,
      hasPlaceholder,
      formats: { webp: webpSrc, avif: avifSrc, jpg: jpgSrc, png: pngSrc },
    });
    // Reiniciar estado cuando cambia la fuente
    setAttemptCount(0);
    setError(false);
    setIsLoading(true);

    // Verificar si la imagen es una URL absoluta
    const isAbsoluteUrl =
      src.startsWith("http://") || src.startsWith("https://");

    // Verificar si la URL es válida
    if (!src || src === "") {
      logImageDebug(`⚠️ URL de imagen inválida, usando fallback`, {
        fallbackSrc,
      });
      setImgSrc(fallbackSrc);
      setError(true);
      setIsLoading(false);
      return;
    }

    // Crear una variable para controlar si el efecto sigue activo
    let isActive = true;

    if (isAbsoluteUrl) {
      // Si es una URL absoluta, usarla directamente
      if (isActive) {
        setImgSrc(src);
        setIsLoading(false);
      }
    } else {
      // Intentar cargar la imagen directamente
      if (isActive) {
        tryLoadImage(src);
      }
    }

    // Función de limpieza
    return () => {
      isActive = false;
    };
  }, [
    src,
    fallbackSrc,
    isAssetPath,
    tryLoadImage,
    webpSrc,
    avifSrc,
    jpgSrc,
    pngSrc,
  ]);

  // Registrar información de depuración
  useEffect(() => {
    // Solo registrar en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log(`[OptimizedImage] Renderizando imagen: ${src}`, {
        imgSrc,
        isLoading,
        error,
        hasPlaceholder,
        isAssetPath,
        fill: props.fill,
        width: props.width,
        height: props.height,
      });
    }
  }, [
    src,
    imgSrc,
    isLoading,
    error,
    hasPlaceholder,
    isAssetPath,
    props.fill,
    props.width,
    props.height,
  ]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Imagen principal */}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          isLoading ? "opacity-0" : "opacity-100",
          error ? "grayscale-[50%] contrast-[90%]" : "",
          className
        )}
        placeholder="empty"
        onLoad={(e) => {
          // Registrar información de la imagen cargada
          if (process.env.NODE_ENV === "development") {
            const img = e.currentTarget as HTMLImageElement;
            console.log(`[OptimizedImage] Imagen cargada: ${imgSrc}`, {
              width: img.width,
              height: img.height,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              complete: img.complete,
            });
          }
          setIsLoading(false);
        }}
        onError={(e) => {
          // Registrar error
          console.error(`[OptimizedImage] Error al cargar imagen: ${imgSrc}`, {
            src,
            imgSrc,
            alt,
            attemptCount,
            isAssetPath,
          });

          // Si hay un error al cargar la imagen, usar directamente el fallback
          setImgSrc(fallbackSrc);
          setError(true);
        }}
      />

      {/* Indicador de carga */}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-gray-100/20 backdrop-blur-sm",
            loadingClassName
          )}
        >
          <div className="w-8 h-8 border-2 border-mascolor-primary/30 border-t-mascolor-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Indicador de error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/40 backdrop-blur-sm">
          <div className="text-mascolor-primary text-sm bg-white/80 px-2 py-1 rounded-md">
            Error al cargar la imagen
          </div>
        </div>
      )}

      {/* Información de depuración (solo en desarrollo) */}
      {process.env.NODE_ENV === "development" && error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs p-1">
          Error: {imgSrc}
        </div>
      )}
    </div>
  );
}
