import { Metadata } from "next";
import { generateMetadata as generatePageMetadata } from "@/components/seo/metadata";
import SearchResultsPage from "./page-client";

/**
 * Genera metadatos dinámicos para la página de búsqueda
 * @param searchParams Parámetros de búsqueda de la URL
 * @returns Metadatos para la página
 */
export function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
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
interface SearchPageProps {
  params: {};
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return <SearchResultsPage query={query} />;
}
