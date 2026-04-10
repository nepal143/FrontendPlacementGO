"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Resume = {
  id: string;
  status: string;
  parsedJson?: any;
};

export default function ResumePage() {
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;

  const [resume, setResume] = useState<Resume | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) return;

    const load = async () => {
      try {
        const data = await apiFetch(
          `http://localhost:8080/api/resumes/${resumeId}`
        );
        setResume(data);
      } catch (e: any) {
        setError(e.message || "Failed to load resume");
      }
    };

    load();
  }, [resumeId]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!resume) return <p>Loading resume...</p>;

  let parsed: any = null;
  try {
    parsed =
      typeof resume.parsedJson === "string"
        ? JSON.parse(resume.parsedJson)
        : resume.parsedJson;
  } catch {
    parsed = null;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Resume</h1>

      <p>
        <strong>Status:</strong> {resume.status}
      </p>

      {parsed && (
        <>
          <h2>Parsed Resume</h2>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: 16,
              borderRadius: 8,
              overflowX: "auto",
            }}
          >
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
