import SearchResultsWrapper from "./search-wrapper";
import { Suspense } from "react";

/**
 * Página de búsqueda de productos
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.searchParams - Parámetros de búsqueda
 * @returns {JSX.Element} Componente de página
 */
export default function SearchPage({ searchParams }) {
  // Extraer la consulta de búsqueda
  const query = typeof searchParams?.q === "string" ? searchParams.q : "";

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchResultsWrapper query={query} />
    </Suspense>
  );
}
