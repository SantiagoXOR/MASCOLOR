import { Metadata } from "next";
import { generateMetadata } from "@/components/seo/metadata";
import { ProductsPageClient } from "./page-client";

export const metadata: Metadata = generateMetadata({
  title: "Catálogo de Productos - Pinturas y Revestimientos",
  description:
    "Explora nuestro catálogo completo de pinturas y revestimientos de alta calidad. Encuentra productos por marca y categoría.",
  keywords: [
    "catálogo productos",
    "pinturas",
    "revestimientos",
    "facilfix",
    "premium",
    "expression",
    "ecopainting",
    "newhouse",
  ],
  canonical: "/productos",
});

export default function ProductsPage() {
  return <ProductsPageClient />;
}
