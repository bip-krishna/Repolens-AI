"use client";

import { useState, useCallback } from "react";

/**
 * Generic hook for lazy-loading AI-powered analysis data.
 * Only fetches when explicitly triggered (e.g., when a tab is selected).
 */
export function useLazyFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const fetch_ = useCallback(async () => {
    if (fetched) return; // Don't re-fetch
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || "Failed to fetch");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [url, fetched]);

  return { data, loading, error, fetch: fetch_, fetched };
}
