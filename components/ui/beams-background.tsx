"use client";

import { useEffect, useRef } from "react";
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
    width: 40 + Math.random() * 80, // Beams más anchos para mayor presencia
    length: height * 3, // Beams más largos
    angle: angle,
    speed: 0.7 + Math.random() * 1.4, // Velocidad ligeramente mayor
    opacity: 0.2 + Math.random() * 0.25, // Mayor opacidad base
    // Adaptado a los colores de +COLOR (tonos de púrpura/magenta)
    hue: 310 + Math.random() * 40, // Rango más amplio para tonos magenta/púrpura
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.025 + Math.random() * 0.035, // Pulso ligeramente más rápido
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "strong",
}: BeamsBackgroundProps) {
  // Asegurarse de que intensity sea uno de los valores válidos
  const safeIntensity =
    typeof intensity === "string" &&
    ["subtle", "medium", "strong", "very-strong"].includes(intensity)
      ? intensity
      : "medium";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 30; // Aumentado para más densidad visual

  const opacityMap = {
    subtle: 0.75,
    medium: 0.9,
    strong: 1.1,
    "very-strong": 1.3,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () =>
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

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(30px)"; // Reducido para mayor definición

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        // Reset beam when it goes off screen
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [safeIntensity]);

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
        style={{ filter: "blur(12px)" }} // Reducido para mayor definición
      />

      <motion.div
        className="absolute inset-0 bg-mascolor-pink-950/50" // Reducida opacidad para que se vean más los beams
        animate={{
          opacity: [0.5, 0.6, 0.5], // Valores más bajos para mayor contraste con los beams
        }}
        transition={{
          duration: 8, // Más rápido para mayor dinamismo
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          backdropFilter: "blur(15px)", // Reducido para mayor definición
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
