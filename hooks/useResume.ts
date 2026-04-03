import { useState, useEffect, useCallback } from "react";
import { ResumeSummary } from "../types/resume.types";
import { getUserResumes } from "../services/resume.service";

export function useResumes() {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserResumes();
      setResumes(data);
    } catch (e: any) {
      setError(e.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { resumes, loading, error, refresh };
}
