import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePaginatedSearch, PAGE_SIZE } from "../usePaginatedSearch";

const items = Array.from({ length: 25 }, (_, i) => ({ id: i, title: `Project ${i}` }));

describe("usePaginatedSearch", () => {
  it("paginates into pages of PAGE_SIZE", () => {
    const { result } = renderHook(() => usePaginatedSearch(items, ["title"]));

    expect(result.current.pageItems).toHaveLength(PAGE_SIZE);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(25);
  });

  it("moves to the next page", () => {
    const { result } = renderHook(() => usePaginatedSearch(items, ["title"]));

    act(() => result.current.setPage(2));

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems[0].id).toBe(10);
  });

  it("filters by search term and resets to page 1", () => {
    const { result } = renderHook(() => usePaginatedSearch(items, ["title"]));

    act(() => result.current.setPage(2));
    act(() => result.current.setSearch("Project 1"));

    // Matches "Project 1", "Project 10"-"Project 19" = 11 items.
    expect(result.current.totalCount).toBe(11);
    expect(result.current.page).toBe(1);
  });

  it("clamps the page if the filtered result set shrinks below the current page", () => {
    const { result } = renderHook(() => usePaginatedSearch(items, ["title"]));

    act(() => result.current.setPage(3));
    act(() => result.current.setSearch("Project 2"));

    // Matches "Project 2", "Project 20"-"Project 24" = 6 items = 1 page.
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(1);
  });
});
