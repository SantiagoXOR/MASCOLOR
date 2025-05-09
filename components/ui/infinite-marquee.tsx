"use client";

import React, { ReactNode, useRef, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  childrenClassName?: string;
  onItemHover?: (brand: string) => void;
  onItemClick?: (brand: string) => void;
}

export function InfiniteMarquee({
  children,
  direction = "left",
  speed = 20,
  pauseOnHover = true,
  className,
  childrenClassName,
  onItemHover,
  onItemClick,
}: InfiniteMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [duplicates, setDuplicates] = React.useState(1);

  // Configurar el valor de movimiento
  const baseX = useMotionValue(0);
  const smoothX = useSpring(baseX, { damping: 50, stiffness: 300 });

  // Determinar cuántas copias del contenido necesitamos para llenar el contenedor
  useEffect(() => {
    if (!contentRef.current || !marqueeRef.current) return;

    const calculateWidths = () => {
      const contentWidth = contentRef.current?.offsetWidth || 0;
      const containerWidth = marqueeRef.current?.offsetWidth || 0;

      setContentWidth(contentWidth);
      setContainerWidth(containerWidth);

      // Para un carrusel infinito, necesitamos solo 2 copias:
      // - Una para la vista actual
      // - Una para el desplazamiento continuo
      // Reducimos el número para evitar duplicación visual excesiva
      const duplicatesNeeded = Math.max(2, Math.ceil((containerWidth * 2) / contentWidth));
      setDuplicates(duplicatesNeeded);
    };

    calculateWidths();

    // Recalcular cuando cambie el tamaño de la ventana
    window.addEventListener("resize", calculateWidths);
    return () => {
      window.removeEventListener("resize", calculateWidths);
    };
  }, [children]);

  // Animar el desplazamiento
  useAnimationFrame((time, delta) => {
    if (!contentRef.current || !marqueeRef.current || contentWidth <= 0) return;

    // Calcular la nueva posición
    const moveBy = direction === "left" ? -speed : speed;
    const newX = baseX.get() + moveBy * (delta / 1000);

    // Reiniciar la posición cuando se haya desplazado una copia completa
    if (direction === "left") {
      // Si va hacia la izquierda, reiniciar cuando llegue al final
      if (newX <= -contentWidth) {
        // Reiniciar al inicio pero con un pequeño offset para evitar saltos visuales
        baseX.set(baseX.get() + contentWidth);
      } else {
        baseX.set(newX);
      }
    } else {
      // Si va hacia la derecha, reiniciar cuando llegue al inicio
      if (newX >= contentWidth) {
        // Reiniciar al final pero con un pequeño offset para evitar saltos visuales
        baseX.set(baseX.get() - contentWidth);
      } else {
        baseX.set(newX);
      }
    }
  });

  // Crear un array con duplicados del contenido
  // Limitamos a solo 2 duplicados para evitar la duplicación visual excesiva
  const contentArray = Array.from({ length: Math.min(2, duplicates) }, (_, i) => (
    <div
      key={i}
      className={cn("flex-shrink-0", childrenClassName)}
      ref={i === 0 ? contentRef : undefined}
    >
      {children}
    </div>
  ));

  // Función para manejar eventos de hover en los elementos del marquee
  const handleItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onItemHover) return;

    // Buscar el elemento con data-brand
    const target = e.target as HTMLElement;
    const brandElement = target.closest('[data-brand]');

    if (brandElement) {
      const brand = brandElement.getAttribute('data-brand');
      if (brand) {
        onItemHover(brand);
      }
    }
  };

  // Función para manejar eventos de clic en los elementos del marquee
  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onItemClick) return;

    // Buscar el elemento con data-brand
    const target = e.target as HTMLElement;
    const brandElement = target.closest('[data-brand]');

    if (brandElement) {
      const brand = brandElement.getAttribute('data-brand');
      if (brand) {
        onItemClick(brand);
      }
    }
  };

  return (
    <div
      ref={marqueeRef}
      className={cn(
        "overflow-hidden relative",
        className
      )}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
      }}
    >
      <motion.div
        className="flex"
        style={{ x: smoothX }}
        whileHover={pauseOnHover ? { x: smoothX.get() } : undefined}
        onMouseOver={handleItemHover}
        onClick={handleItemClick}
      >
        {/* Usamos un número controlado de duplicados para evitar duplicación visual excesiva */}
        {contentArray}
      </motion.div>
    </div>
  );
}
