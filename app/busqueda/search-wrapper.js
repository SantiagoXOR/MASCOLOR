"use client";

import SearchResultsClient from "./page-client";

/**
 * Componente wrapper para la página de resultados de búsqueda
 * @param {Object} props - Propiedades del componente
 * @param {string} props.query - Consulta de búsqueda
 * @returns {JSX.Element} Componente de página
 */
export default function SearchResultsWrapper({ query }) {
  return <SearchResultsClient query={query} />;
}
