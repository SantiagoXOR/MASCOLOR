"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StaticBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

/**
 * Un componente de fondo estático que consume menos recursos que BeamsBackground
 * Ideal para dispositivos móviles o de bajo rendimiento
 */
export function StaticBackground({
  className,
  children,
  intensity = "subtle",
}: StaticBackgroundProps) {
  // Mapeo de intensidad a opacidad
  const opacityMap = {
    subtle: 0.3,
    medium: 0.4,
    strong: 0.5,
  };
  
  // Usar la intensidad para determinar la opacidad
  const opacity = opacityMap[intensity as keyof typeof opacityMap] || 0.3;

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-neutral-950",
        className
      )}
    >
      {/* Fondo estático con gradiente y textura */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-mascolor-pink-950/80 to-mascolor-primary/30"
        style={{
          backgroundImage: "url('/images/paint-texture.jpg')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
          opacity,
        }}
      />
      
      {/* Efecto de luz sutil con motion */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-mascolor-primary/20 to-transparent"
        animate={{
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {/* Contenido */}
      {children ? (
        <div className="relative z-10 w-full h-full">{children}</div>
      ) : (
        <div className="relative z-10 flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6 px-4 text-center"></div>
        </div>
      )}
    </div>
  );
}
