"use client";

import { useState, useEffect, useCallback } from "react";
import type { GitData } from "@/types";

export function useGitData(owner: string, repo: string) {
  const [gitData, setGitData] = useState<GitData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/git?owner=${owner}&repo=${repo}`);
      const data = await res.json();
      if (data.success) {
        setGitData(data.data);
      } else {
        setError(data.error || "Failed to fetch git data");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchGitData();
  }, [fetchGitData]);

  return { gitData, loading, error, refetch: fetchGitData };
}
