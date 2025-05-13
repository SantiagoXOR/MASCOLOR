"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Droplet,
  Home,
  Building,
  Paintbrush,
  Waves,
  Hammer,
  Brush,
  Palette,
  Thermometer,
  Shield,
  Leaf,
  Layers,
} from "lucide-react";

type IconType =
  | "interior"
  | "exterior"
  | "pool"
  | "sports"
  | "metal"
  | "wood"
  | "concrete"
  | "waterproof"
  | "thermal"
  | "protective"
  | "eco"
  | "texture"
  | "paint"
  | "floor"
  | "ceiling"
  | "trowel"
  | "drop"
  | "primer"
  | "brick"
  | "putty";

interface ProductIconProps {
  type: IconType;
  className?: string;
  size?: number;
}

const iconConfig: Record<IconType, React.ElementType> = {
  interior: Home,
  exterior: Building,
  pool: Waves,
  sports: Droplet,
  metal: Hammer,
  wood: Brush,
  concrete: Layers,
  waterproof: Droplet,
  thermal: Thermometer,
  protective: Shield,
  eco: Leaf,
  texture: Palette,
  paint: Paintbrush,
  floor: Building,
  ceiling: Home,
  trowel: Hammer,
  drop: Droplet,
  primer: Paintbrush,
  brick: Layers,
  putty: Palette,
};

export function ProductIcon({ type, className, size = 16 }: ProductIconProps) {
  // Usar Paintbrush como icono por defecto si el tipo no está definido
  const IconComponent = iconConfig[type] || Paintbrush;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <IconComponent size={size} className={cn("text-current", className)} />
    </div>
  );
}
