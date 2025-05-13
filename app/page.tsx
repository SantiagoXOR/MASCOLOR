import { Metadata } from "next";
import { generateMetadata } from "@/components/seo/metadata";
import LayoutWithComponents from "./layout-with-components";
import { HeroSection } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products";
import { BenefitsSection } from "@/components/sections/benefits";
import { ContactSection } from "@/components/sections/contact";
import { CategoriesSection } from "@/components/sections/categories";
import { PaintCalculator } from "@/components/sections/paint-calculator";
import { TrustBlocks } from "@/components/sections/trust-blocks";

export const metadata: Metadata = generateMetadata({
  title: "Pinturas y revestimientos de alta calidad",
  description:
    "Descubre nuestra línea de pinturas y revestimientos de alta calidad para tus proyectos de construcción y decoración.",
  keywords: ["pinturas", "revestimientos", "decoración", "hogar"],
  canonical: "/",
});

export default function Home() {
  return (
    <LayoutWithComponents>
      <HeroSection />
      <TrustBlocks />
      <CategoriesSection />
      <ProductsSection />
      <BenefitsSection />
      <PaintCalculator />
      <ContactSection />
    </LayoutWithComponents>
  );
}
