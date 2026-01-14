"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  MessageCircle,
  Phone,
  PlusCircle,
  Building,
  Home,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeaturedBrands } from "@/hooks/useFeaturedBrands";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useFloatingComponents } from "@/hooks/useFloatingComponents";
import { getHeroContent } from "@/lib/api/hero";
import { HeroContent } from "@/types/hero";

/**
 * Componente HeroBentoMobile
 * Implementa una versión mobile-first del Hero utilizando el sistema BentoGrid
 * siguiendo exactamente el mockup de referencia
 */
export function HeroBentoMobile() {
  // Estado para el carrusel de marcas y productos
  const [activeBrand, setActiveBrand] = useState<string>("premium");
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(true);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Estado para los datos del Hero
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para el modal del asesor
  const [advisorModalOpen, setAdvisorModalOpen] = useState<boolean>(false);

  // Obtener marcas y assets desde Supabase
  const { brands, brandAssets, loading: loadingBrands } = useFeaturedBrands();

  // Obtener información del dispositivo
  const { isMobile, isTablet, screenWidth } = useDeviceDetection();

  // Hook para manejar estado de componentes flotantes
  const { isChatOpen, setAdvisorWidgetVisible } = useFloatingComponents();

  // Debug temporal (solo en desarrollo)
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 Debug HeroBentoMobile:", {
        brands: brands.length,
        brandAssets: Object.keys(brandAssets).length,
        loadingBrands,
        activeBrand,
      });
    }
  }, [brands, brandAssets, loadingBrands, activeBrand]);

  // Mapeo de marcas a imágenes de productos y fondos (fallback si Supabase falla)
  const fallbackBrandAssets = {
    facilfix: {
      bucket: "/images/products/facilfix-exterior-blanco.png",
      background: "/images/buckets/FACILFIX.jpg",
      backgroundMobile: "/images/buckets/FACILFIX-mobile.jpg",
      title: "Reparación y construcción profesional",
    },
    ecopainting: {
      bucket: "/images/products/ecopainting-membrana.png",
      background: "/images/buckets/ECOPAINTING.jpg",
      backgroundMobile: "/images/buckets/ECOPAINTING-mobile.jpg",
      title: "Rendimiento inteligente para obras y hogares",
    },
    newhouse: {
      bucket: "/images/products/newhouse-barniz-marino.png",
      background: "/images/buckets/NEWHOUSE.jpg",
      backgroundMobile: "/images/buckets/NEWHOUSE-mobile.jpg",
      title: "Protección total para maderas expuestas",
    },
    premium: {
      bucket: "/images/products/premium-lavable-super.png",
      background: "/images/buckets/PREMIUM.jpg",
      backgroundMobile: "/images/buckets/PREMIUM-mobile.jpg",
      title: "Acabados de alta calidad para interiores y exteriores",
    },
    expression: {
      bucket: "/images/products/expression-latex-interior.png",
      background: "/images/buckets/EXPRESSION.jpg",
      backgroundMobile: "/images/buckets/EXPRESSION-mobile.jpg",
      title: "Colores vibrantes para espacios con personalidad",
    },
  };

  // Cargar datos del Hero desde Supabase
  useEffect(() => {
    async function loadHeroContent() {
      try {
        console.log("🔄 Cargando contenido del Hero desde Supabase...");
        const data = await getHeroContent();
        console.log("✅ Contenido del Hero cargado correctamente");
        setHeroData(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error cargando contenido del Hero:", error);

        // Intentar cargar de nuevo después de un breve retraso
        console.log(
          "🔄 Reintentando cargar contenido del Hero en 2 segundos..."
        );
        setTimeout(async () => {
          try {
            const fallbackData = await getHeroContent();
            console.log("✅ Contenido del Hero cargado en segundo intento");
            setHeroData(fallbackData);
          } catch (retryError) {
            console.error("❌ Error en segundo intento:", retryError);
            console.log(
              "🔧 Usando datos de respaldo locales para mantener la funcionalidad"
            );

            // Crear datos de respaldo locales si todo falla
            const localFallbackData = {
              headline: "Para tus proyectos de construcción y decoración",
              subheadline: "Calidad profesional en cada producto",
              productTitle: "Producto destacado",
              backgroundImageUrl: "/images/buckets/PREMIUM-mobile.jpg",
              productImageUrl: "/images/products/premium-lavable-super.png",
              logoUrl: "/images/logos/+color.svg",
              productBrandLogoUrl: "/images/logos/premium.svg",
              phone: "0800-555-0189",
              advisor: {
                name: "Leandro",
                role: "Asesor técnico",
                iconUrl: "/images/advisors/leandro.jpg",
              },
              benefitItems: [
                {
                  title: "Calidad Premium",
                  subtitle: "Productos de alta calidad",
                  icon: "/images/icons/quality.svg",
                },
                {
                  title: "Asesoramiento",
                  subtitle: "Expertos a tu disposición",
                  icon: "/images/icons/support.svg",
                },
                {
                  title: "Garantía",
                  subtitle: "Respaldo en cada compra",
                  icon: "/images/icons/warranty.svg",
                },
              ],
            };
            setHeroData(localFallbackData);
          } finally {
            setLoading(false);
          }
        }, 2000);
      }
    }

    if (loading) {
      loadHeroContent();
    }
  }, [loading]);

  // Función para cambiar la marca activa
  const changeBrand = (brand: string) => {
    if (brand === activeBrand || isChanging) return;

    setIsChanging(true);
    setActiveBrand(brand);

    // Reiniciar el temporizador de autoplay
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }

    // Habilitar autoplay nuevamente después de un cambio manual
    setAutoplayEnabled(true);

    // Permitir otro cambio después de la transición
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };

  // Efecto para autoplay
  useEffect(() => {
    if (!autoplayEnabled) return;

    const nextBrand = () => {
      if (isChanging) return;

      const brandSlugs =
        brands.length > 0
          ? brands.map((brand) => brand.slug)
          : Object.keys(fallbackBrandAssets);

      const currentIndex = brandSlugs.indexOf(activeBrand);
      const nextIndex = (currentIndex + 1) % brandSlugs.length;

      changeBrand(brandSlugs[nextIndex]);
    };

    // Configurar temporizador para cambio automático
    autoplayTimerRef.current = setTimeout(nextBrand, 5000);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [activeBrand, autoplayEnabled, isChanging, brands]);

  // Notificar al estado global que el widget del asesor está visible
  useEffect(() => {
    setAdvisorWidgetVisible(true);
    return () => setAdvisorWidgetVisible(false);
  }, [setAdvisorWidgetVisible]);

  // Determinar qué assets usar (Supabase o fallback)
  const assetsToUse =
    brands.length > 0 && brandAssets ? brandAssets : fallbackBrandAssets;

  // Determinar qué imagen de fondo usar (móvil o desktop)
  const getBackgroundImage = (brandSlug: string) => {
    const asset = assetsToUse[brandSlug as keyof typeof assetsToUse];
    if (!asset) return "/images/buckets/PREMIUM-mobile.jpg";

    // Priorizar imagen móvil si está disponible y estamos en móvil/tablet
    if ((isMobile || isTablet) && asset.backgroundMobile) {
      return asset.backgroundMobile;
    }

    // Fallback a imagen desktop si no hay móvil
    return asset.background || "/images/buckets/PREMIUM-mobile.jpg";
  };

  // Función para obtener el logo dinámico de la marca activa
  const getDynamicBrandLogo = (brandSlug: string) => {
    // Buscar en las marcas de Supabase primero
    const supabaseBrand = brands.find((brand) => brand.slug === brandSlug);
    if (supabaseBrand && supabaseBrand.logo_url) {
      return supabaseBrand.logo_url;
    }

    // Fallback a la ruta estándar basada en el slug
    return `/images/logos/${brandSlug}.svg`;
  };

  // Mostrar estado de carga mientras se obtienen los datos
  if (loading || !heroData) {
    return (
      <section className="relative w-full h-[90vh] overflow-hidden rounded-b-[2rem] shadow-lg bg-mascolor-pink-50 flex flex-col items-center justify-center md:hidden">
        <div className="animate-pulse text-mascolor-primary text-xl font-bold mb-4">
          Cargando...
        </div>
        <div className="text-sm text-mascolor-gray-600 max-w-[80%] text-center">
          Estamos preparando la mejor experiencia para ti
        </div>
      </section>
    );
  }

  // Extraer datos del Hero
  const {
    headline,
    subheadline,
    productTitle,
    backgroundImageUrl,
    productImageUrl,
    logoUrl,
    productBrandLogoUrl,
    phone,
    advisor,
    benefitItems,
  } = heroData;

  return (
    <section className="relative w-full overflow-hidden lg:hidden hero-bento-mobile min-h-screen">
      {/* Imagen de fondo fotográfica con overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={getBackgroundImage(activeBrand)}
              alt={`Interior elegante con productos ${activeBrand}`}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay sutil con color primario para mantener legibilidad */}
        <div className="absolute inset-0 bg-mascolor-primary/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10" />
      </div>

      {/* Layout Bento Grid siguiendo el mockup exacto */}
      <div className="relative z-20 min-h-screen p-4 flex flex-col gap-3">
        {/* 1. HEADER - Logo (izquierda) + Teléfono (derecha) */}
        <motion.div
          className="flex justify-between items-center bg-white/95 backdrop-blur-xl shadow-lg border-white/30 rounded-2xl px-4 py-3 min-h-[56px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo +COLOR */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logos/+color.svg"
              alt="Logo +Color - Pinturas y revestimientos de alta calidad"
              width={120}
              height={28}
              className="drop-shadow-sm"
              priority
              unoptimized={true}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)",
              }}
            />
          </div>

          {/* Botón teléfono */}
          <a
            href={`tel:${phone}`}
            className="bg-mascolor-primary hover:bg-mascolor-primary/90 text-white px-4 py-2.5 rounded-full text-sm font-mazzard font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
          >
            <Phone size={16} className="text-white" />
            <span className="tracking-wide text-sm font-bold leading-none">
              {phone}
            </span>
          </a>
        </motion.div>

        {/* 2. SECCIÓN PRINCIPAL - Título grande con indicadores */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden min-h-[140px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {/* Título principal */}
          <div className="relative z-30">
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeBrand}
                initial={{ opacity: 0, x: -40, y: -15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 40, y: 15 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-white text-2xl md:text-3xl font-mazzard font-bold leading-[1.2] drop-shadow-2xl tracking-tight"
                style={{
                  textShadow:
                    "0 4px 20px rgba(0, 0, 0, 0.7), 0 2px 8px rgba(0, 0, 0, 0.5)",
                }}
              >
                {assetsToUse[activeBrand as keyof typeof assetsToUse]?.title ||
                  "Acabados de alta calidad para interiores y exteriores"}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Indicadores de carrusel - pequeños y sutiles en la esquina superior derecha */}
          <div className="absolute top-4 right-4 z-30 flex gap-1 bg-black/20 backdrop-blur-md rounded-full px-2 py-1">
            {(brands.length > 0 ? brands : Object.keys(fallbackBrandAssets))
              .slice(0, 5)
              .map((brand, index) => {
                const brandSlug =
                  typeof brand === "string" ? brand : brand.slug;
                return (
                  <motion.button
                    key={brandSlug}
                    onClick={() => {
                      setAutoplayEnabled(false);
                      changeBrand(brandSlug);
                      setTimeout(() => setAutoplayEnabled(true), 4000);
                    }}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      brandSlug === activeBrand
                        ? "bg-white shadow-sm"
                        : "bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Ver producto ${brandSlug}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    animate={{
                      scale: brandSlug === activeBrand ? 1.3 : 1,
                      opacity: brandSlug === activeBrand ? 1 : 0.6,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                );
              })}
          </div>
        </motion.div>

        {/* 3. SECCIÓN PRODUCTO - Logo de marca (izquierda) + Producto (derecha) */}
        <motion.div
          className="bg-mascolor-primary/95 backdrop-blur-md rounded-2xl p-4 relative overflow-hidden min-h-[160px] flex items-center justify-between"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Logo de marca - izquierda */}
          <div className="flex-1 flex items-center justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[120px] min-h-[80px] flex items-center justify-center"
              >
                <Image
                  src={getDynamicBrandLogo(activeBrand)}
                  alt={`Logo de la marca ${activeBrand}`}
                  width={100}
                  height={32}
                  className="object-contain drop-shadow-lg max-w-[90px] max-h-[28px]"
                  unoptimized={true}
                  onError={(e) => {
                    if (process.env.NODE_ENV === "development") {
                      console.log(
                        `Error cargando logo del producto: ${activeBrand}`
                      );
                    }
                    e.currentTarget.src = "/images/logos/placeholder.svg";
                  }}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(100%) drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Imagen del producto - derecha */}
          <div className="flex-1 flex items-center justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand}
                initial={{ opacity: 0, scale: 0.6, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: -30 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                className="relative"
              >
                <Image
                  src={
                    assetsToUse[activeBrand as keyof typeof assetsToUse]
                      ?.bucket || productImageUrl
                  }
                  alt={`Producto premium ${activeBrand}`}
                  width={140}
                  height={140}
                  className="object-contain drop-shadow-2xl"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    if (process.env.NODE_ENV === "development") {
                      console.log(
                        `Error cargando imagen del producto: ${activeBrand}`
                      );
                    }
                    e.currentTarget.src = "/images/products/placeholder.jpg";
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Área de gestos táctiles para swipe */}
          <motion.div
            className="absolute inset-0 z-25 cursor-grab active:cursor-grabbing touch-pan-x"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setAutoplayEnabled(false)}
            onDragEnd={(event, info) => {
              const threshold = 50;
              const velocity = Math.abs(info.velocity.x);
              const offset = info.offset.x;
              const shouldSwipe =
                Math.abs(offset) > threshold || velocity > 400;

              if (shouldSwipe) {
                const brands_list =
                  brands.length > 0 ? brands : Object.keys(fallbackBrandAssets);
                const currentIndex = brands_list.findIndex(
                  (b) => (typeof b === "string" ? b : b.slug) === activeBrand
                );

                if (offset > 0) {
                  const prevIndex =
                    currentIndex > 0
                      ? currentIndex - 1
                      : brands_list.length - 1;
                  const prevBrand = brands_list[prevIndex];
                  changeBrand(
                    typeof prevBrand === "string" ? prevBrand : prevBrand.slug
                  );
                } else {
                  const nextIndex =
                    currentIndex < brands_list.length - 1
                      ? currentIndex + 1
                      : 0;
                  const nextBrand = brands_list[nextIndex];
                  changeBrand(
                    typeof nextBrand === "string" ? nextBrand : nextBrand.slug
                  );
                }
              }

              setTimeout(() => setAutoplayEnabled(true), 3000);
            }}
            whileDrag={{ scale: 0.99, rotateY: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
          />
        </motion.div>

        {/* 4. GRID INFERIOR - 4 secciones según mockup */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {/* Para Exteriores */}
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const categoriesSection = document.getElementById("categories");
              if (categoriesSection) {
                categoriesSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <Building className="w-8 h-8 text-mascolor-primary mb-2" />
            <span className="text-sm font-mazzard font-bold text-mascolor-gray-800">
              Para Exteriores
            </span>
          </motion.div>

          {/* Para Interiores */}
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const categoriesSection = document.getElementById("categories");
              if (categoriesSection) {
                categoriesSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <Home className="w-8 h-8 text-mascolor-primary mb-2" />
            <span className="text-sm font-mazzard font-bold text-mascolor-gray-800">
              Para Interiores
            </span>
          </motion.div>

          {/* Asesor Leandro */}
          <motion.div
            className="bg-mascolor-primary/95 backdrop-blur-xl rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAdvisorModalOpen(true)}
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-mazzard font-bold text-white">
              Leandro
            </span>
            <span className="text-xs text-white/80">Asesor de +COLOR</span>
          </motion.div>

          {/* Sección adicional - Garantía */}
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 min-h-[120px] flex flex-col items-center justify-center text-center shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-mascolor-primary/10 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-mascolor-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
              </svg>
            </div>
            <span className="text-xs font-mazzard font-bold text-mascolor-gray-800">
              2 años garantía
            </span>
          </motion.div>
        </motion.div>

        {/* 5. FOOTER - Botones de contacto según mockup */}
        <motion.div
          className="flex items-center gap-3 mt-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          {/* Avatar de Leandro */}
          <motion.div
            className="w-14 h-14 bg-mascolor-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAdvisorModalOpen(true)}
          >
            <User className="w-7 h-7 text-white" />
            {/* Indicador online */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          {/* Contenedor principal con botones */}
          <div className="flex-1 bg-white rounded-full border-4 border-mascolor-primary p-1 shadow-lg">
            <div className="flex items-center gap-2">
              {/* Botón WhatsApp principal */}
              <motion.button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full py-3 px-4 font-mazzard font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open(
                    `https://wa.me/5493547639917?text=${encodeURIComponent(
                      "Hola, me gustaría obtener más información sobre los productos de +COLOR."
                    )}`,
                    "_blank"
                  )
                }
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">Contactar por WhatsApp</span>
              </motion.button>

              {/* Botón +COLOR circular */}
              <motion.button
                className="w-12 h-12 bg-mascolor-primary hover:bg-mascolor-primary/90 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: [0, 360] }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.2 },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const productsSection = document.getElementById("products");
                  if (productsSection) {
                    productsSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  } else {
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <PlusCircle className="w-6 h-6 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
