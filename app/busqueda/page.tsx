import SearchResultsPage from "./page-client";

export const metadata = {
  title: "Búsqueda | +COLOR",
  description:
    "Busca productos de +COLOR por nombre, categoría o características.",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return <SearchResultsPage query={query} />;
}
