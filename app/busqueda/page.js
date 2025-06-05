import SearchResultsWrapper from "./search-wrapper";
import { Suspense } from "react";

/**
 * Página de búsqueda de productos
 * @param {Object} props - Propiedades del componente
 * @param {Promise<Object>} props.searchParams - Parámetros de búsqueda
 * @returns {JSX.Element} Componente de página
 */
export default async function SearchPage({ searchParams }) {
  // Extraer la consulta de búsqueda
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchResultsWrapper query={query} />
    </Suspense>
  );
}
