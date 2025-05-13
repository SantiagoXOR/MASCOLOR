import { Metadata } from "next";
import { generateMetadata as generatePageMetadata } from "@/components/seo/metadata";
import SearchResultsPage from "./page-client";

type SearchParams = { q?: string };

/**
 * Genera metadatos dinámicos para la página de búsqueda
 * @param props Propiedades para la generación de metadatos
 * @returns Metadatos para la página
 */
export function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Metadata {
  const query = searchParams.q || "";

  return generatePageMetadata({
    title: `Resultados de búsqueda: ${query}`,
    description: `Resultados de búsqueda para "${query}" en +COLOR.`,
    canonical: `/busqueda?q=${encodeURIComponent(query)}`,
  });
}

/**
 * Página de resultados de búsqueda
 * @param props Propiedades de la página
 * @returns Componente de página
 */
export default function SearchPage({
  params,
  searchParams,
}: {
  params: {};
  searchParams: SearchParams;
}) {
  const query = searchParams.q || "";

  return <SearchResultsPage query={query} />;
}
