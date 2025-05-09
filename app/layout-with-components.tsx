"use client";

import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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

  return (
    <>
      <Header />
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
      <Footer />
      <WhatsAppButton />
    </>
  );
}
