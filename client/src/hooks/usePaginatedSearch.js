import { useMemo, useState } from "react";

export const PAGE_SIZE = 10;

/**
 * Client-side search + pagination for an admin list. `searchKeys` are the
 * item properties checked against the search term (case-insensitive
 * substring match); pass the same keys a table's columns are already
 * rendering so results line up with what the admin sees on screen.
 */
export function usePaginatedSearch(items, searchKeys) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the search term changes. Adjusted during
  // render (React's recommended pattern for this) rather than in an effect,
  // so it takes effect in the same render instead of causing an extra one.
  const [prevSearch, setPrevSearch] = useState(search);
  if (search !== prevSearch) {
    setPrevSearch(search);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(term))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    search,
    setSearch,
    page: safePage,
    setPage,
    pageItems,
    totalPages,
    totalCount: filtered.length,
    pageSize: PAGE_SIZE,
  };
}
