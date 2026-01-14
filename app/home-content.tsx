"use client";

import { HeroSection } from "@/components/sections/hero";
import { HeroBentoMobile } from "@/components/sections/hero-bento-mobile";
import { ProductsSection } from "@/components/sections/products";
import { BenefitsSection } from "@/components/sections/benefits";
import { ContactSection } from "@/components/sections/contact";
import { CategoriesSection } from "@/components/sections/categories";
import { PaintCalculator } from "@/components/sections/paint-calculator";
import { TrustBlocks } from "@/components/sections/trust-blocks";
import { CategoriesBento } from "@/components/sections/categories-bento";
import { ProductsBento } from "@/components/sections/products-bento";
import { BenefitsBento } from "@/components/sections/benefits-bento";
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

      {/* Trust Blocks - Siempre visible */}
      <TrustBlocks />

      {/* Categorías - Desktop tradicional, Mobile Bento */}
      <div className="hidden lg:block">
        <CategoriesSection />
      </div>
      <CategoriesBento />

      {/* Productos - Desktop tradicional, Mobile Bento */}
      <div className="hidden lg:block">
        <ProductsSection />
      </div>
      <ProductsBento />

      {/* Beneficios - Desktop tradicional, Mobile Bento */}
      <div className="hidden lg:block">
        <BenefitsSection />
      </div>
      <BenefitsBento />

      {/* Calculadora y Contacto - Siempre visibles */}
      <PaintCalculator />
      <ContactSection />
    </>
  );
}
