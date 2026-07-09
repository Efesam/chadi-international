import { useEffect, useState } from "react";

/**
 * Fetches a CMS-managed collection (or any async value) for use on the
 * public site, with loading/error state. `fetcher` should be a stable
 * function reference (e.g. `projectsApi.list`) — pass a new inline
 * function only if it doesn't need to be re-created every render.
 */
export function useCollection(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetcher();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load content");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
