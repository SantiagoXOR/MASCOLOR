"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "custom";
  customAspectRatio?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  animate?: boolean;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  rounded?: boolean;
}

/**
 * Componente para imágenes optimizadas dentro del BentoGrid
 * Incluye soporte para fallback, animaciones y overlay
 */
export function BentoImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fallbackSrc = "/images/products/placeholder.jpg",
  aspectRatio = "square",
  customAspectRatio,
  objectFit = "cover",
  animate = true,
  overlay = false,
  overlayColor = "#870064",
  overlayOpacity = 0.3,
  rounded = true,
}: BentoImageProps) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Actualizar src cuando cambie la prop
  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
    setIsLoaded(false);
  }, [src]);

  // Determinar la relación de aspecto
  const aspectRatioClass = customAspectRatio
    ? `aspect-[${customAspectRatio}]`
    : aspectRatio === "square"
    ? "aspect-square"
    : aspectRatio === "video"
    ? "aspect-video"
    : aspectRatio === "portrait"
    ? "aspect-[3/4]"
    : "";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        aspectRatioClass,
        rounded && "rounded-xl",
        containerClassName
      )}
    >
      {/* Imagen principal */}
      <Image
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-all duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          animate && "group-hover:scale-105",
          objectFit === "contain" && "object-contain",
          objectFit === "cover" && "object-cover",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
          className
        )}
        onError={() => {
          if (!error && fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setError(false);
          } else {
            setError(true);
          }
        }}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Overlay opcional */}
      {overlay && (
        <div
          className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-50"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Efecto de carga */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-mascolor-gray-100 animate-pulse rounded-xl" />
      )}
    </div>
  );
}
