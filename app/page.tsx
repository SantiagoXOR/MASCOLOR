import LayoutWithComponents from "./layout-with-components";
import { HeroSection } from "@/components/sections/hero";
import { ProductsSection } from "@/components/sections/products";
import { BenefitsSection } from "@/components/sections/benefits";
import { ContactSection } from "@/components/sections/contact";
import { CategoriesSection } from "@/components/sections/categories";
import { PaintCalculator } from "@/components/sections/paint-calculator";
import { TrustBlocks } from "@/components/sections/trust-blocks";

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
