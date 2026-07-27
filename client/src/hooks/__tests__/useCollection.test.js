import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCollection } from "../useCollection";

describe("useCollection", () => {
  it("starts in a loading state, then resolves with data", async () => {
    const fetcher = vi.fn().mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useCollection(fetcher));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(result.current.error).toBe("");
  });

  it("sets an error message when the fetcher rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useCollection(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("network down");
    expect(result.current.data).toBe(null);
  });

  it("ignores a stale response after deps change before it resolves", async () => {
    let resolveFirst;
    const first = new Promise((resolve) => {
      resolveFirst = resolve;
    });
    const fetcher = vi.fn().mockReturnValueOnce(first).mockResolvedValueOnce("second");

    const { result, rerender } = renderHook(({ id }) => useCollection(fetcher, [id]), {
      initialProps: { id: 1 },
    });

    rerender({ id: 2 });
    await waitFor(() => expect(result.current.data).toBe("second"));

    resolveFirst("first (stale)");
    await new Promise((r) => setTimeout(r, 0));

    // The stale first call resolving late must not clobber the newer result.
    expect(result.current.data).toBe("second");
  });
});
