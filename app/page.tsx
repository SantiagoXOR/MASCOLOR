import { Metadata } from "next";
import { generateMetadata } from "@/components/seo/metadata";
import LayoutWithComponents from "./layout-with-components";
import { HomeContent } from "./home-content";

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
      <HomeContent />
    </LayoutWithComponents>
  );
}
