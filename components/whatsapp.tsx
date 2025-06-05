"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary" | "color";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Botón para contacto directo por WhatsApp
 */
export function WhatsAppButton({
  phone = "5493547639917",
  message = "Hola, me gustaría obtener más información sobre los productos de +COLOR.",
  variant = "default",
  size = "default",
  className = "",
}: WhatsAppButtonProps) {
  // Construir la URL de WhatsApp con el número y mensaje
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        variant={variant}
        size={size}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2"
        onClick={() => window.open(whatsappUrl, "_blank")}
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </Button>
    </motion.div>
  );
}
