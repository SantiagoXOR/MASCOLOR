"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, PlusCircle } from "lucide-react";
import { BentoGrid, BentoItem, BentoImage } from "@/components/ui/bento";
import { Button } from "@/components/ui/button";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { BeamsBackground } from "@/components/ui/beams-background";
import { useFeaturedBrands } from "@/hooks/useFeaturedBrands";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
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

  // Obtener marcas y assets desde Supabase
  const { brands, brandAssets, loading: loadingBrands } = useFeaturedBrands();

  // Obtener información del dispositivo
  const { isMobile, isTablet, screenWidth } = useDeviceDetection();

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
    <section className="relative w-full overflow-hidden lg:hidden hero-bento-mobile min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header mejorado - Más compacto y con mejor espaciado */}
      <div className="relative z-50 mx-4 mt-3 mb-6">
        <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-full px-4 py-2 border border-white/30 flex justify-between items-center min-h-[48px]">
          {/* Logo +COLOR completo - Color principal de la marca */}
          <div className="flex-shrink-0 mr-3">
            <Image
              src="/images/logos/+color.svg"
              alt="Logo +Color - Pinturas y revestimientos de alta calidad"
              width={120}
              height={28}
              className="hero-logo drop-shadow-sm"
              priority
              unoptimized={true}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(10%) sepia(83%) saturate(5728%) hue-rotate(307deg) brightness(77%) contrast(111%)", // Color #870064
              }}
            />
          </div>

          {/* Botón teléfono compacto - Una sola línea */}
          <a
            href={`tel:${phone}`}
            className="bg-mascolor-primary hover:bg-mascolor-primary/90 text-white px-4 py-2 rounded-full text-xs font-mazzard font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
            style={{
              boxShadow:
                "0 4px 12px rgba(135, 0, 100, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Phone size={14} className="text-white" />
            <span className="tracking-wide text-xs font-bold leading-none">
              {phone}
            </span>
          </a>
        </div>
      </div>

      {/* Contenedor principal del carrusel - Diseño aspiracional premium */}
      <div className="relative mx-4 mb-8 rounded-[2rem] overflow-hidden shadow-2xl border border-white/30">
        {/* Imagen de fondo fotográfica nítida */}
        <div className="relative h-[580px] overflow-hidden">
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
                className="object-cover object-center filter brightness-110 contrast-105"
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay sutil que mantiene legibilidad sin oscurecer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-mascolor-primary/10 via-transparent to-transparent z-10" />

          {/* Contenido flotante premium - Jerarquía tipográfica mejorada */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-10">
            {/* Título principal - Esquina superior izquierda con tipografía premium */}
            <div className="flex-1 flex items-start pt-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeBrand}
                  initial={{ opacity: 0, x: -40, y: -15 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 40, y: 15 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-white text-4xl md:text-5xl font-mazzard font-bold leading-[1.1] max-w-[70%] drop-shadow-2xl tracking-tight"
                  style={{
                    textShadow:
                      "0 4px 20px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {assetsToUse[activeBrand as keyof typeof assetsToUse]
                    ?.title || "Rendimiento inteligente para obras y hogares"}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Contenedor en el borde inferior para marca y producto */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-25 w-full max-w-sm">
              <div className="flex items-end justify-between px-4">
                {/* Logo de marca */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBrand}
                    initial={{ opacity: 0, y: 40, x: -25 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -40, x: 25 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="relative"
                  >
                    {/* Degradado sutil que se desvanece hacia el producto */}
                    <div className="absolute inset-0 bg-gradient-to-r from-mascolor-primary/85 via-mascolor-primary/50 via-mascolor-primary/30 to-transparent rounded-2xl blur-sm scale-105" />
                    <div className="relative bg-gradient-to-r from-mascolor-primary/90 via-mascolor-primary/60 via-mascolor-primary/40 to-transparent rounded-2xl backdrop-blur-sm w-40 h-28 flex items-center justify-center">
                      <Image
                        src={getDynamicBrandLogo(activeBrand)}
                        alt={`Logo de la marca ${activeBrand}`}
                        width={120}
                        height={32}
                        className="object-contain drop-shadow-lg relative z-10 max-w-[110px] max-h-[28px]"
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
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Producto */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBrand}
                    initial={{ opacity: 0, scale: 0.6, y: 70, x: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: -50, x: -25 }}
                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                    className="relative"
                  >
                    <Image
                      src={
                        assetsToUse[activeBrand as keyof typeof assetsToUse]
                          ?.bucket || productImageUrl
                      }
                      alt={`Producto premium ${activeBrand}`}
                      width={160}
                      height={160}
                      className="object-contain drop-shadow-2xl"
                      priority
                      unoptimized={true}
                      onError={(e) => {
                        if (process.env.NODE_ENV === "development") {
                          console.log(
                            `Error cargando imagen del producto: ${activeBrand}`
                          );
                        }
                        e.currentTarget.src =
                          "/images/products/placeholder.jpg";
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Indicadores de carrusel sutiles - Esquina superior derecha */}
          <div className="absolute top-6 right-6 z-30 flex gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/20 shadow-lg">
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
                      setTimeout(() => {
                        setAutoplayEnabled(true);
                      }, 4000);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      brandSlug === activeBrand
                        ? "bg-white shadow-md"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Ver producto ${brandSlug}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    animate={{
                      scale: brandSlug === activeBrand ? 1.3 : 1,
                      opacity: brandSlug === activeBrand ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                );
              })}
          </div>

          {/* Área de gestos táctiles para swipe - Sin barra visual */}
          <motion.div
            className="absolute inset-0 z-25 cursor-grab active:cursor-grabbing touch-pan-x"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            dragMomentum={false}
            onDragStart={() => setAutoplayEnabled(false)}
            onDragEnd={(event, info) => {
              const threshold = 60;
              const velocity = Math.abs(info.velocity.x);
              const offset = info.offset.x;
              const shouldSwipe =
                Math.abs(offset) > threshold || velocity > 500;

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

              setTimeout(() => setAutoplayEnabled(true), 4000);
            }}
            whileDrag={{ scale: 0.98, rotateY: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        </div>
      </div>

      {/* Módulo del asesor premium - Expandido y destacado */}
      <motion.div
        className="mx-4 mb-8 bg-white/98 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden border border-white/30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        style={{
          boxShadow:
            "0 25px 50px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(135, 0, 100, 0.1)",
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center">
            {/* Información del asesor expandida */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={advisor.iconUrl}
                  alt={advisor.name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-mascolor-primary object-cover shadow-xl"
                  style={{
                    boxShadow: "0 8px 20px rgba(135, 0, 100, 0.3)",
                  }}
                />
                {/* Indicador de estado online premium */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-mascolor-primary font-mazzard font-bold text-xl tracking-wide">
                  {advisor.name}
                </p>
                <p className="text-mascolor-gray-600 text-base font-medium">
                  {advisor.role}
                </p>
                <p className="text-green-600 text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                  En línea ahora
                </p>
              </div>
            </div>

            {/* Botones de acción premium */}
            <div className="flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-4 shadow-xl transition-all duration-300 hover:shadow-2xl font-mazzard font-bold text-base border-2 border-green-400/30"
                  onClick={() =>
                    window.open(
                      `https://wa.me/5493547639917?text=${encodeURIComponent(
                        "Hola, me gustaría obtener más información sobre los productos de +COLOR."
                      )}`,
                      "_blank"
                    )
                  }
                  style={{
                    boxShadow:
                      "0 12px 24px rgba(34, 197, 94, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <span>WhatsApp</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/95 shadow-xl border-3 border-mascolor-primary/50 hover:border-mascolor-primary/80 transition-all duration-300 hover:shadow-2xl w-16 h-16 text-mascolor-primary hover:bg-mascolor-primary/5"
                  style={{
                    boxShadow: "0 8px 16px rgba(135, 0, 100, 0.2)",
                  }}
                >
                  <PlusCircle className="w-8 h-8" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
