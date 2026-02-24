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
    if (!jobDescription.trim()) return alert("Please paste job description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);
      setError("");
      setPdfBase64(null);
      setLatex(null);

      const data = await apiFetch("http://localhost:8080/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

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
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Resume Optimizer</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tailor your profile to specific job descriptions and beat the ATS filters instantly.
          </p>
        </div>

        {/* Upload Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Upload Resume */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-500">
                {/* File icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </span>
              <span className="font-semibold text-slate-900 text-sm">1. Upload Your Resume</span>
            </div>

            {/* Drag & Drop Zone */}
            <label className="block border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                {/* Upload cloud icon */}
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, DOCX up to 10MB</p>
                </div>
                <button
                  type="button"
                  className="mt-1 px-4 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition"
                  onClick={(e) => e.preventDefault()}
                >
                  Select File
                </button>
              </div>
            </label>

            {file && (
              <p className="text-sm text-blue-600 mt-3">✓ {file.name}</p>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-blue-500">
                {/* Clipboard icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </span>
              <span className="font-semibold text-slate-900 text-sm">2. Paste Job Description</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job requirements here to identify missing keywords and skills..."
              className="w-full h-[calc(100%-3rem)] min-h-[200px] border border-slate-200 rounded-lg p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <button
            onClick={uploadResume}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-70 flex items-center gap-2 text-sm"
          >
            {/* Sparkle / wand icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>
            </svg>
            {loading ? "Generating Resume..." : "Generate Optimized Resume"}
          </button>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              AI-Powered Analysis
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              ATS Score Optimization
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Preview Section */}
        {pdfBase64 && (
          <div>
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-semibold text-base text-slate-900">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Optimization Preview
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-50 border border-green-200 text-green-600 font-bold text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  ATS SCORE <span className="text-green-700 text-base font-extrabold">94%</span>
                </div>

                <button
                  onClick={downloadPdf}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* Original */}
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Original Version
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl h-[600px] flex items-center justify-center text-slate-400 text-sm">
                  Original resume preview
                </div>
              </div>

              {/* Optimized */}
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-3">
                  Optimized Version (ATS-Ready)
                </div>

                <div className="relative bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  <iframe
                    src={`data:application/pdf;base64,${pdfBase64}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-[600px]"
                  />
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    OPTIMIZED BY AI
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    ATS Keywords Found (12)
                  </div>
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    Format: Standard Harvard
                  </div>
                  <button className="text-blue-600 hover:underline">Edit Formatting</button>
                </div>
              </div>
            </div>

            {/* LaTeX Source */}
            {latex && (
              <details className="mt-8">
                <summary className="cursor-pointer font-semibold text-sm text-slate-700">
                  Show LaTeX Source
                </summary>
                <pre className="mt-4 bg-slate-200 p-4 rounded-md text-xs overflow-x-auto">
                  {latex}
                </pre>
              </details>
            )}
          </div>
        )}

      </div>
    </div>
  );
}