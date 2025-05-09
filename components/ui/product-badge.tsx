"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, TrendingUp, Sparkles, Clock } from "lucide-react";

type BadgeType = "new" | "bestseller" | "featured" | "limited";

interface ProductBadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig = {
  new: {
    label: "Nuevo",
    icon: <Sparkles className="h-3 w-3 mr-1" />,
    className: "bg-blue-500 hover:bg-blue-600",
  },
  bestseller: {
    label: "+ Vendido",
    icon: <TrendingUp className="h-3 w-3 mr-1" />,
    className: "bg-amber-500 hover:bg-amber-600",
  },
  featured: {
    label: "Destacado",
    icon: <Star className="h-3 w-3 mr-1" />,
    className: "bg-mascolor-primary hover:bg-mascolor-primary/90",
  },
  limited: {
    label: "Edición Limitada",
    icon: <Clock className="h-3 w-3 mr-1" />,
    className: "bg-purple-600 hover:bg-purple-700",
  },
};

export function ProductBadge({ type, className }: ProductBadgeProps) {
  const config = badgeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge
        className={cn(
          "flex items-center text-white font-medium px-2 py-1",
          config.className,
          className
        )}
      >
        {config.icon}
        {config.label}
      </Badge>
    </motion.div>
  );
}
