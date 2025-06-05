import { Metadata } from "next";
import { Suspense } from "react";
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

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mascolor-primary mx-auto mb-4"></div>
        <p className="text-mascolor-gray-600">
          Cargando catálogo de productos...
        </p>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageClient />
    </Suspense>
  );
}
