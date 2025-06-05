"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  rows?: number;
  gap?: number;
}

/**
 * Componente contenedor principal para el sistema BentoGrid
 * Implementa un grid responsive con soporte para diferentes configuraciones
 */
export function BentoGrid({
  children,
  className,
  cols = 4,
  rows,
  gap = 4,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-auto",
        `grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
