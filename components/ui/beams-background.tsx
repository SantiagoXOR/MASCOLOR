"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong" | "very-strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 60 + Math.random() * 60, // Beams más anchos pero menos variados para mejor rendimiento
    length: height * 2.5, // Beams ligeramente más cortos para mejor rendimiento
    angle: angle,
    speed: 0.5 + Math.random() * 1.0, // Velocidad reducida para menos actualizaciones
    opacity: 0.15 + Math.random() * 0.2, // Menor opacidad base para mejor rendimiento
    // Adaptado a los colores de +COLOR (tonos de púrpura/magenta)
    hue: 310 + Math.random() * 30, // Rango más estrecho para mejor rendimiento
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.02, // Pulso más lento para mejor rendimiento
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "subtle",
}: BeamsBackgroundProps) {
  // Asegurarse de que intensity sea uno de los valores válidos
  const safeIntensity =
    typeof intensity === "string" &&
    ["subtle", "medium", "strong", "very-strong"].includes(intensity)
      ? intensity
      : "subtle";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 8; // Reducido drásticamente para mejorar rendimiento

  // Detectar si es un dispositivo móvil para reducir aún más los efectos
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar dispositivos móviles o de bajo rendimiento
    setIsMobile(window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);
  }, []);

  const opacityMap = {
    subtle: 0.4, // Reducido significativamente
    medium: 0.6, // Reducido significativamente
    strong: 0.8, // Reducido significativamente
    "very-strong": 1.0, // Reducido significativamente
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Usar un DPR máximo de 1.5 para mejorar rendimiento en dispositivos de alta densidad
      // En móviles, usar DPR de 1 para máximo rendimiento
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      // Reducir drásticamente la cantidad de beams en móviles
      const totalBeams = isMobile ? MINIMUM_BEAMS * 0.7 : MINIMUM_BEAMS;
      beamsRef.current = Array.from({ length: Math.floor(totalBeams) }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;

      const column = index % 4; // Distribuir en 4 columnas para más variedad
      const spacing = canvas.width / 4;

      beam.y = canvas.height + 100;
      beam.x =
        column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.7; // Mayor variación horizontal
      beam.width = 120 + Math.random() * 120; // Beams más anchos
      beam.speed = 0.6 + Math.random() * 0.5; // Velocidad ligeramente mayor
      // Adaptado a los colores de +COLOR
      beam.hue = 310 + (index * 30) / totalBeams; // Rango más amplio para tonos magenta/púrpura (310-340)
      beam.opacity = 0.25 + Math.random() * 0.15; // Mayor opacidad base
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      // Usar safeIntensity para obtener el valor de opacidad
      const intensityValue = opacityMap[safeIntensity];

      const pulsingOpacity =
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * intensityValue;

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      // Enhanced gradient with multiple color stops - adaptado a los colores de +COLOR con mayor saturación y brillo
      gradient.addColorStop(0, `hsla(${beam.hue}, 95%, 45%, 0)`); // Más brillante para +COLOR
      gradient.addColorStop(
        0.05, // Inicio más cercano para un efecto más definido
        `hsla(${beam.hue}, 95%, 45%, ${pulsingOpacity * 0.6})`
      );
      gradient.addColorStop(
        0.3,
        `hsla(${beam.hue}, 95%, 50%, ${pulsingOpacity * 1.1})` // Mayor saturación y brillo
      );
      gradient.addColorStop(
        0.5,
        `hsla(${beam.hue}, 100%, 55%, ${pulsingOpacity * 1.2})` // Punto máximo más brillante
      );
      gradient.addColorStop(
        0.7,
        `hsla(${beam.hue}, 95%, 50%, ${pulsingOpacity * 1.1})`
      );
      gradient.addColorStop(
        0.95,
        `hsla(${beam.hue}, 95%, 45%, ${pulsingOpacity * 0.6})`
      );
      gradient.addColorStop(1, `hsla(${beam.hue}, 95%, 45%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    // Variable para controlar la frecuencia de actualización
    let frameCount = 0;
    // Aumentar el frameSkip para reducir actualizaciones
    // En móviles, actualizar cada 4 frames, en desktop cada 2-3
    const frameSkip = isMobile ? 3 : 2;

    // Variable para controlar la velocidad de actualización
    let lastUpdateTime = 0;
    const minUpdateInterval = isMobile ? 100 : 50; // ms entre actualizaciones

    function animate(timestamp: number) {
      if (!canvas || !ctx) return;

      // Limitar la frecuencia de actualización basada en tiempo
      const elapsed = timestamp - lastUpdateTime;

      if (elapsed > minUpdateInterval) {
        frameCount++;
        lastUpdateTime = timestamp;

        // Solo actualizar en ciertos frames para mejorar rendimiento
        if (frameCount % (frameSkip + 1) === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Reducir el blur para mejorar rendimiento
          ctx.filter = isMobile ? "blur(15px)" : "blur(18px)";

          const totalBeams = beamsRef.current.length;
          beamsRef.current.forEach((beam, index) => {
            // Reducir la velocidad de movimiento para menos actualizaciones
            beam.y -= beam.speed * 0.8;
            beam.pulse += beam.pulseSpeed * 0.8;

            // Reset beam when it goes off screen
            if (beam.y + beam.length < -100) {
              resetBeam(beam, index, totalBeams);
            }

            drawBeam(ctx, beam);
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Iniciar la animación con timestamp
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [safeIntensity, isMobile]);

  // Si es un dispositivo móvil o de bajo rendimiento, usar una versión estática
  if (isMobile) {
    return (
      <div
        className={cn(
          "relative min-h-screen w-full overflow-hidden bg-neutral-950",
          className
        )}
      >
        {/* Fondo estático para dispositivos móviles */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-mascolor-pink-950/80 to-mascolor-primary/30"
          style={{
            backgroundImage: "url('/images/paint-texture.jpg')",
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            opacity: 0.4,
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

  // Versión completa para desktop
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-neutral-950",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ filter: "blur(10px)" }}
      />

      <motion.div
        className="absolute inset-0 bg-mascolor-pink-950/50"
        animate={{
          opacity: [0.5, 0.52, 0.5], // Reducido aún más el rango
        }}
        transition={{
          duration: 12, // Más lento para reducir actualizaciones
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(8px)", // Reducido para mejorar rendimiento
        }}
      />

      {children ? (
        <div className="relative z-10 w-full h-full">{children}</div>
      ) : (
        <div className="relative z-10 flex h-screen w-full items-center justify-center">
          {/* Contenedor vacío cuando no hay children */}
          <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
            {/* No mostramos ningún texto por defecto */}
          </div>
        </div>
      )}
    </div>
  );
}
