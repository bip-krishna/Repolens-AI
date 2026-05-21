"use client";

import { useState, useEffect, useCallback } from "react";
import type { RepoAnalysis } from "@/types";

export function useAnalysis(owner: string, repo: string) {
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze?owner=${owner}&repo=${repo}`);
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error || "Failed to analyze repository");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { analysis, loading, error, refetch: fetchAnalysis };
}
