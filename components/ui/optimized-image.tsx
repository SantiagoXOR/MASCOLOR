"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
  usePlaceholder?: boolean;
  useBlur?: boolean;
}

/**
 * Componente OptimizedImage que extiende el componente Image de Next.js
 * con características adicionales como:
 * - Carga progresiva con placeholders
 * - Soporte para formatos modernos (WebP, AVIF)
 * - Manejo de errores con imagen de respaldo
 * - Efectos de transición personalizables
 */
export function OptimizedImage({
  src,
  fallbackSrc,
  placeholderSrc,
  alt,
  className,
  containerClassName,
  loadingClassName,
  usePlaceholder = true,
  useBlur = true,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    usePlaceholder && placeholderSrc ? placeholderSrc : src
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Determinar si hay un placeholder disponible
  const hasPlaceholder = usePlaceholder && placeholderSrc;
  
  // Generar rutas para formatos modernos
  const srcWithoutExt = src.substring(0, src.lastIndexOf("."));
  const webpSrc = `${srcWithoutExt}.webp`;
  const avifSrc = `${srcWithoutExt}.avif`;

  // Efecto para cargar la imagen real después del placeholder
  useEffect(() => {
    if (hasPlaceholder) {
      const img = new window.Image();
      img.src = src;
      
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
      };
      
      img.onerror = () => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
          setError(true);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [src, fallbackSrc, hasPlaceholder]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Imagen principal con soporte para formatos modernos */}
      <picture>
        {/* AVIF - Mejor compresión pero menor soporte */}
        <source srcSet={avifSrc} type="image/avif" />
        {/* WebP - Buena compresión y mejor soporte */}
        <source srcSet={webpSrc} type="image/webp" />
        {/* Imagen original como fallback */}
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
          placeholder={hasPlaceholder && useBlur ? "blur" : "empty"}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            if (fallbackSrc && !error) {
              setImgSrc(fallbackSrc);
              setError(true);
            }
          }}
        />
      </picture>

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
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/40 backdrop-blur-sm">
          <div className="text-mascolor-primary text-sm bg-white/80 px-2 py-1 rounded-md">
            Error al cargar la imagen
          </div>
        </div>
      )}
    </div>
  );
}
