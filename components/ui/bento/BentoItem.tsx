"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  animationDelay?: number;
  motionProps?: MotionProps;
}

/**
 * Componente para cada elemento del BentoGrid
 * Permite configurar el tamaño del elemento en términos de columnas y filas
 */
export function BentoItem({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  animationDelay = 0,
  motionProps,
  ...props
}: BentoItemProps) {
  // Configuración de animaciones
  const defaultMotionProps: MotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.5,
      delay: animationDelay,
      ease: "easeOut",
    },
    whileHover: { y: -5 },
  };

  // Combinar props de animación predeterminadas con las personalizadas
  const combinedMotionProps = { ...defaultMotionProps, ...motionProps };

  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm border border-mascolor-gray-200 hover:border-mascolor-primary/30 transition-all duration-300",
        `col-span-1 sm:col-span-${colSpan}`,
        `row-span-${rowSpan}`,
        className
      )}
      {...combinedMotionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
