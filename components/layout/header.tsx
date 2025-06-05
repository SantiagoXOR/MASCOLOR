"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Menu, X, Phone } from "lucide-react";
import { MascolorNavBar } from "@/components/ui/mascolor-navbar";
import { SearchBar } from "@/components/ui/search-bar";

// Componente para el enlace "Skip to content" para accesibilidad
const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-mascolor-primary focus:outline-none focus:ring-2 focus:ring-mascolor-primary"
  >
    Saltar al contenido principal
  </a>
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Efecto para manejar el scroll y aplicar el efecto sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Verificar el estado inicial del scroll
    handleScroll();

    // Agregar el evento de scroll
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Limpiar el evento al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`header-desktop ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <SkipToContent />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo con animación */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="relative h-10 w-40 z-50 block">
              <Image
                src="/images/logos/+color.svg"
                alt="Logo +COLOR"
                fill
                className="object-contain transition-all duration-300"
                style={{
                  filter: isScrolled
                    ? `brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)` // Color #870064
                    : "brightness(0) invert(1)", // Blanco
                  opacity: 1,
                }}
                priority
              />
            </Link>
          </motion.div>

          {/* Contenedor derecho para navegación, búsqueda y botón */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Desktop Navigation con animación */}
            <motion.div
              className={`${isScrolled ? "text-mascolor-dark" : "text-white"}`}
              style={
                {
                  "--foreground": isScrolled
                    ? "rgb(33, 33, 33)"
                    : "rgb(255, 255, 255)",
                  "--background": isScrolled
                    ? "rgb(255, 255, 255)"
                    : "transparent",
                } as React.CSSProperties
              }
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <MascolorNavBar />
            </motion.div>

            {/* Barra de búsqueda con animación */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={isScrolled ? "text-mascolor-dark" : "text-white"}
            >
              <SearchBar
                iconColor={isScrolled ? "text-mascolor-dark" : "text-white"}
              />
            </motion.div>

            {/* CTA Button con animación */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatedButton
                variant={isScrolled ? "secondary" : "outline"}
                size="default"
                asChild={true}
                href="tel:08005550189"
                className={`group rounded-full ${
                  isScrolled
                    ? "border-mascolor-primary text-mascolor-primary hover:bg-mascolor-primary hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-mascolor-primary"
                }`}
              >
                <span className="flex items-center gap-2">
                  0800-555-0189
                  <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </span>
              </AnimatedButton>
            </motion.div>
          </div>

          {/* Mobile Menu Button con animación */}
          <motion.button
            className={`md:hidden ${
              isScrolled ? "text-mascolor-primary" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu con animación */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-6">
                <div
                  className="text-mascolor-dark"
                  style={
                    {
                      "--foreground": "rgb(33, 33, 33)",
                      "--background": "rgb(255, 255, 255)",
                    } as React.CSSProperties
                  }
                >
                  <MascolorNavBar isMobile={true} />
                </div>

                {/* Barra de búsqueda en móvil */}
                <div className="py-2 flex justify-center">
                  <SearchBar iconColor="text-mascolor-dark" />
                </div>

                <AnimatedButton
                  variant="default"
                  size="default"
                  asChild={true}
                  href="tel:08005550189"
                  className="w-full mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-center gap-2">
                    0800-555-0189
                    <Phone className="w-4 h-4" />
                  </span>
                </AnimatedButton>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
