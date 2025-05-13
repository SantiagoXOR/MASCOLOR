"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
  href?: string;
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  asChild = false,
  href,
  ...props
}: AnimatedButtonProps) {
  // Configuración de colores según variante
  const getButtonStyles = () => {
    switch (variant) {
      case "default":
        return {
          background: "white", // Invertido: antes era #870064
          textColor: "#870064", // Invertido: antes era white
          hoverBackground: "#870064", // Invertido: antes era #FF00C7
          hoverTextColor: "white", // Se mantiene white
          borderColor: "#870064", // Añadido borde del color de la marca
        };
      case "outline":
        return {
          background: "transparent",
          textColor: "white",
          hoverBackground: "white",
          hoverTextColor: "#870064",
          borderColor: "white",
        };
      case "secondary":
        return {
          background: "#870064", // Invertido: antes era white
          textColor: "white", // Invertido: antes era #870064
          hoverBackground: "white", // Invertido: antes era #870064
          hoverTextColor: "#870064", // Invertido: antes era white
          borderColor: "transparent", // Cambiado para mejor estética
        };
      default:
        return {
          background: "white", // Invertido: antes era #870064
          textColor: "#870064", // Invertido: antes era white
          hoverBackground: "#870064", // Invertido: antes era #FF00C7
          hoverTextColor: "white", // Se mantiene white
          borderColor: "#870064", // Añadido borde del color de la marca
        };
    }
  };

  const buttonStyles = getButtonStyles();

  // Configuración de tamaño
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Separar las props de motion de las props de button
  const motionProps = {
    whileHover: {
      backgroundColor: buttonStyles.hoverBackground,
      color: buttonStyles.hoverTextColor,
      borderRadius: "12px",
      scale: 1.02,
      transition: { duration: 0.3 },
    },
    whileTap: { scale: 0.98 },
  };

  const buttonContent = (
    <motion.button
      className={cn(
        "animated-button relative flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all",
        sizeClasses[size as keyof typeof sizeClasses],
        className
      )}
      style={
        {
          backgroundColor: buttonStyles.background,
          color: buttonStyles.textColor,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: buttonStyles.borderColor,
        } as React.CSSProperties
      }
      {...motionProps}
      {...props}
    >
      <motion.span
        className="relative z-10"
        initial={{ x: 0 }}
        whileHover={{ x: variant === "default" ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );

  if (asChild && href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}
