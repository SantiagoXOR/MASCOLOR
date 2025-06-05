"use client";

import { HeroSection } from "@/components/sections/hero";
import { HeroBentoMobile } from "@/components/sections/hero-bento-mobile";
import { ProductsSection } from "@/components/sections/products";
import { BenefitsSection } from "@/components/sections/benefits";
import { ContactSection } from "@/components/sections/contact";
import { CategoriesSection } from "@/components/sections/categories";
import { PaintCalculator } from "@/components/sections/paint-calculator";
import { TrustBlocks } from "@/components/sections/trust-blocks";
import { useMobileHero } from "@/hooks/useDeviceDetection";

export function HomeContent() {
  const showMobileHero = useMobileHero();

  return (
    <>
      {/* Versión desktop del Hero - Solo mostrar en desktop */}
      <div className="hidden lg:block">
        <HeroSection />
      </div>

      {/* Versión mobile-first del Hero - Solo mostrar en móvil/tablet */}
      <div className="block lg:hidden">
        <HeroBentoMobile />
      </div>

      {/* Versión alternativa del Hero (oculta) */}
      {/* <HeroBento /> */}

      <TrustBlocks />
      <CategoriesSection />
      <ProductsSection />
      <BenefitsSection />
      <PaintCalculator />
      <ContactSection />
    </>
  );
}
