"use client";

import { useSearchParams } from "next/navigation";
import SearchResultsPage from "./page-client";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return <SearchResultsPage query={query} />;
}
