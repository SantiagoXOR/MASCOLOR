"use client";

import { Header } from "@/components/layout/header";
import { ChatPopup } from "@/components/ui/chat-popup";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Importar el Footer de manera dinámica para evitar problemas con framer-motion
const Footer = dynamic(
  () => import("@/components/layout/footer").then((mod) => mod.Footer),
  {
    ssr: false,
  }
);

export default function LayoutWithComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Scroll al inicio cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Detectar si es un dispositivo móvil o de bajo rendimiento
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    // Detectar dispositivos móviles o de bajo rendimiento
    const isMobile = window.innerWidth < 768;
    const isLowCPU = navigator.hardwareConcurrency <= 4;

    // La propiedad deviceMemory no está disponible en todos los navegadores
    // y no está incluida en el tipo Navigator de TypeScript
    const deviceMemory = (navigator as any).deviceMemory;
    const isLowMemory = deviceMemory && deviceMemory < 4;

    setIsLowPerformanceDevice(isMobile || isLowCPU || Boolean(isLowMemory));
  }, []);

  return (
    <>
      <Header />
      {isLowPerformanceDevice ? (
        // Versión sin animaciones para dispositivos de bajo rendimiento
        <main id="main-content">{children}</main>
      ) : (
        // Versión con animaciones para dispositivos de alto rendimiento
        <AnimatePresence mode="wait">
          <motion.main
            id="main-content"
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      )}
      <Footer />
      <ChatPopup />
    </>
  );
}
