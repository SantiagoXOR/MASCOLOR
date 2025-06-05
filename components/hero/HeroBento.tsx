"use client";

import { Button } from "@/components/ui/button";
import { getHeroContent } from "@/lib/api/hero";
import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp";
import { PhoneIcon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { HeroContent } from "@/types/hero";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Componente HeroBento para la versión mobile-first
 */
export function HeroBento() {
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeroContent() {
      try {
        console.log("Cargando contenido del Hero...");
        const data = await getHeroContent();
        console.log("✅ Contenido del Hero cargado correctamente");
        setHeroData(data);
      } catch (error) {
        console.error("❌ Error cargando contenido del Hero:", error);
        // Intentar cargar de nuevo después de un breve retraso
        setTimeout(async () => {
          try {
            console.log("🔄 Reintentando cargar contenido del Hero...");
            const fallbackData = await getHeroContent();
            console.log("✅ Contenido del Hero cargado en segundo intento");
            setHeroData(fallbackData);
          } catch (retryError) {
            console.error("❌ Error en segundo intento:", retryError);
            // Usar datos de respaldo (getHeroContent ya maneja esto internamente)
          } finally {
            setLoading(false);
          }
        }, 1000);
      } finally {
        if (loading) {
          setLoading(false);
        }
      }
    }

    loadHeroContent();
  }, [loading]);

  if (loading || !heroData) {
    return (
      <section className="relative w-full h-[90vh] overflow-hidden rounded-b-[2rem] shadow-lg bg-mascolor-pink-50 flex flex-col items-center justify-center">
        <div className="animate-pulse text-mascolor-primary text-xl font-bold mb-4">
          Cargando...
        </div>
        <div className="text-sm text-mascolor-gray-600 max-w-[80%] text-center">
          Estamos preparando la mejor experiencia para ti
        </div>
      </section>
    );
  }

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
    <section className="hero-bento-section md:hidden">
      {/* Imagen de fondo con degradado */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Gradiente overlay para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/90 z-10" />
      </div>

      {/* Header + Teléfono */}
      <div className="relative pt-4 px-4 z-20 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={logoUrl} alt="Logo +Color" width={120} height={30} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a
            href={`tel:${phone}`}
            className="bg-mascolor-primary text-white font-bold px-4 py-1 rounded-full flex items-center gap-2 text-sm shadow-md"
          >
            <PhoneIcon size={16} /> {phone}
          </a>
        </motion.div>
      </div>

      {/* Título principal */}
      <motion.div
        className="relative z-20 mt-16 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-3xl font-extrabold leading-tight max-w-[20ch] text-[#870064] drop-shadow-sm text-center">
          {headline}
        </h1>
        <p className="mt-2 text-base text-mascolor-gray-600 text-center">
          {subheadline}
        </p>
      </motion.div>

      {/* Imagen de producto */}
      <motion.div
        className="relative z-20 mt-6 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="hero-bento-product">
          <Image
            src={productImageUrl}
            alt={productTitle}
            width={300}
            height={300}
            className="mx-auto drop-shadow-xl relative z-10"
          />
        </div>
      </motion.div>

      {/* Marca del producto */}
      <motion.div
        className="relative z-20 mt-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Image
          src={productBrandLogoUrl}
          alt="Marca del producto"
          width={180}
          height={40}
          className="mx-auto"
        />
      </motion.div>

      {/* Asesor y botón de contacto */}
      <motion.div
        className="relative z-20 mt-6 px-6 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="hero-bento-advisor">
          <Image
            src={advisor.iconUrl}
            alt={advisor.name}
            width={40}
            height={40}
            className="hero-bento-advisor-image"
          />
          <div className="text-sm">
            <strong className="block text-[#870064]">{advisor.name}</strong>
            <span className="text-mascolor-gray-600 text-xs">
              {advisor.role}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <WhatsAppButton size="sm" />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/90 shadow-sm"
          >
            <PlusCircle className="w-5 h-5 text-mascolor-primary" />
          </Button>
        </div>
      </motion.div>

      {/* Beneficios */}
      <motion.div
        className="relative z-20 mt-6 px-6 grid grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {benefitItems.map((item, index) => (
          <motion.div
            key={item.title}
            className="hero-bento-benefit"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
          >
            <Image
              src={item.icon}
              alt=""
              width={32}
              height={32}
              className="hero-bento-benefit-icon"
            />
            <p className="hero-bento-benefit-title">{item.title}</p>
            <p className="hero-bento-benefit-subtitle">{item.subtitle}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
