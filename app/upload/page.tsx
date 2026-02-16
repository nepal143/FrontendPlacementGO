"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [latex, setLatex] = useState<string | null>(null);
  const [error, setError] = useState("");

  const uploadResume = async () => {
    if (!file) return alert("Please select a file");
    if (!jobDescription.trim())
      return alert("Please paste job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setError("");
      setPdfBase64(null);
      setLatex(null);

      const data = await apiFetch(
        "http://localhost:8080/api/resumes/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!data.pdfBase64) {
        setError("PDF generation failed.");
        return;
      }

      setPdfBase64(data.pdfBase64);
      setLatex(data.latex);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBase64) return;

    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: "auto" }}>
      <h1 style={{ marginBottom: 30 }}>AI Resume Generator</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <textarea
          placeholder="Paste Job Description Here..."
          rows={8}
          style={{ width: "100%", padding: 10 }}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button
        onClick={uploadResume}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: 5,
        }}
      >
        {loading ? "Generating Resume..." : "Generate Resume"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>{error}</p>
      )}

      {/* PDF PREVIEW */}
      {pdfBase64 && (
        <div style={{ marginTop: 50 }}>
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={downloadPdf}
              style={{
                padding: "8px 15px",
                background: "#111",
                color: "#fff",
                borderRadius: 5,
                border: "none",
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </div>

          <iframe
            src={`data:application/pdf;base64,${pdfBase64}`}
            width="100%"
            height="800px"
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      {/* Optional: Show LaTeX */}
      {latex && (
        <div style={{ marginTop: 30 }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              Show LaTeX Source
            </summary>
            <pre
              style={{
                marginTop: 10,
                background: "#f4f4f4",
                padding: 20,
                overflowX: "auto",
                fontSize: 12,
              }}
            >
              {latex}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
