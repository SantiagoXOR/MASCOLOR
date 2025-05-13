"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";

interface SubtleButtonProps extends Omit<HTMLMotionProps<"button">, "style"> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  icon?: React.ReactNode;
  disableLink?: boolean; // Nueva prop para deshabilitar el Link
}

export function SubtleButton({
  children,
  className,
  href,
  icon,
  disableLink = false, // Valor por defecto: false
  ...props
}: SubtleButtonProps) {
  // Separar las props de motion de las props de button
  const motionProps = {
    whileHover: {
      backgroundColor: "rgba(135, 0, 100, 0.05)",
      scale: 1.02,
    },
    whileTap: { scale: 0.98 },
  };

  const buttonContent = (
    <motion.button
      className={cn(
        "subtle-button relative flex items-center justify-center gap-1.5 text-xs font-medium text-mascolor-primary hover:text-mascolor-secondary transition-colors rounded-md py-1.5 px-3 border border-transparent hover:border-mascolor-primary/20",
        className
      )}
      {...motionProps}
      {...props}
    >
      <span>{children}</span>
      {icon || (
        <Plus className="h-3.5 w-3.5 stroke-current transition-all duration-300 group-hover:rotate-90" />
      )}
    </motion.button>
  );

  // Solo envolvemos con Link si href está definido y disableLink es false
  if (href && !disableLink) {
    return (
      <Link href={href} className="inline-block group">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}
