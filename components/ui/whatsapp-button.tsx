"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "541112345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20productos%20de%20%2BCOLOR.`;

  // Mostrar el botón después de 2 segundos o cuando el usuario haga scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Efecto de pulso suave
  useEffect(() => {
    if (isVisible) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    }
  }, [isVisible, controls]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-[24px] right-[24px] z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-green-500 rounded-full shadow-xl hover:bg-green-600 transition-colors"
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            animate={controls}
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white" />
            <span className="sr-only">Contactar por WhatsApp</span>
          </motion.a>

          {/* Tooltip */}
          <motion.div
            className="absolute -top-10 right-0 bg-white text-gray-800 px-3 py-1 rounded-lg shadow-md text-sm whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            ¿Necesitas ayuda?
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white transform rotate-45"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
