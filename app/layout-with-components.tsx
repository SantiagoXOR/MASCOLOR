"use client";

import { Header } from "@/components/layout/header";
import { ChatPopup } from "@/components/ui/chat-popup";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
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
  const { isLowPerformance } = useDeviceDetection();

  // Scroll al inicio cuando cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      {isLowPerformance ? (
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
