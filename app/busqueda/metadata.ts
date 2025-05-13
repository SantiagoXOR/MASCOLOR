import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Búsqueda | +COLOR",
  description: "Busca productos de +COLOR por nombre, categoría o características.",
  keywords: ["búsqueda", "productos", "pinturas", "revestimientos", "+COLOR"],
  openGraph: {
    title: "Búsqueda de productos | +COLOR",
    description: "Encuentra los productos de +COLOR que necesitas para tu proyecto.",
    url: "/busqueda",
    siteName: "+COLOR",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Búsqueda de productos | +COLOR",
    description: "Encuentra los productos de +COLOR que necesitas para tu proyecto.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
