import { Metadata } from "next";
import { siteConfig } from "@/config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  canonical?: string;
  noindex?: boolean;
}

/**
 * Genera metadatos dinámicos para SEO
 * @param props Propiedades para los metadatos
 * @returns Objeto Metadata para Next.js
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  type = "website",
  canonical,
  noindex = false,
}: SEOProps): Metadata {
  // Título completo con el nombre del sitio
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  // Descripción predeterminada si no se proporciona
  const metaDescription = description || siteConfig.description;

  // Palabras clave combinadas
  const metaKeywords = [...(keywords || []), ...siteConfig.keywords];

  // URL canónica
  const metaCanonical = canonical
    ? `${siteConfig.url}${canonical}`
    : siteConfig.url;

  // Imagen para compartir
  const metaImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords.join(", "),

    // Metadatos para robots
    robots: noindex ? "noindex, nofollow" : "index, follow",

    // URL canónica
    alternates: {
      canonical: metaCanonical,
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: metaCanonical,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "es_AR",
      type,
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.creator,
    },
  };
}
