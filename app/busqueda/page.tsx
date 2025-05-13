import { Metadata } from 'next';
import { generateMetadata } from '@/components/seo/metadata';
import SearchResultsPage from './page-client';

/**
 * Genera metadatos dinámicos para la página de búsqueda
 * @param searchParams Parámetros de búsqueda de la URL
 * @returns Metadatos para la página
 */
export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const query = searchParams.q || '';
  
  return generateMetadata({
    title: `Resultados de búsqueda: ${query}`,
    description: `Resultados de búsqueda para "${query}" en +COLOR.`,
    canonical: `/busqueda?q=${encodeURIComponent(query)}`,
  });
}

/**
 * Página de resultados de búsqueda
 * @param searchParams Parámetros de búsqueda de la URL
 * @returns Componente de página
 */
export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  return <SearchResultsPage query={query} />;
}
