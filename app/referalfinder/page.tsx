"use client";

import { useState } from "react";
import Navbar from "../component/Navbar";

// Types matching your backend DTOs
interface CreateReferralResponse {
  referralId: string;
  shareLink: string;
  linkedinSearchLink: string;
  templates: Record<string, string>;
  company?: string;
  role?: string;
}

interface ReferralDetails {
  referralId: string;
  company: string;
  role: string;
  jobDescription: string;
  shareLink: string;
  linkedinSearchLink: string;
  templates: Record<string, string>;
}

const API_BASE_URL = "http://localhost:8080";

// IMPORTANT: Replace with actual user ID from your auth system
const USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function ReferralFinder() {
  const [jobDescription, setJobDescription] = useState("");
  const [detected, setDetected] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  // State for API data
  const [currentReferral, setCurrentReferral] = useState<ReferralDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please provide a job description or LinkedIn URL");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setDetected(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
     console.log(token);

      if (!token) {
        setError("Authentication required. Please log in again.");
        setAnalyzing(false);
        return;
      }

      // Step 1: Create referral request
      const requestBody = {
        jobDescription: jobDescription.trim()
      };

      const response = await fetch(`${API_BASE_URL}/api/referrals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "userId": USER_ID,
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }

      const data: CreateReferralResponse = await response.json();
      
      console.log("API Response:", data); // Debug ke liye
      
      // Step 2: Fetch full referral details by ID
      await fetchReferralById(data.referralId, token);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze job. Please try again.");
      console.error("Error creating referral:", err);
      setDetected(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchReferralById = async (referralId: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/referrals/${referralId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "userId": USER_ID
        }
      });
      
      if (!response.ok) {
        console.warn("Failed to fetch referral details");
        setError("Failed to fetch complete referral details");
        return;
      }

      const data: ReferralDetails = await response.json();
      
      console.log("Referral Details:", data); // Debug ke liye
      
      // Set complete referral data
      setCurrentReferral(data);
      setDetected(true);
      
    } catch (err) {
      console.error("Error fetching referral details:", err);
      setError("Failed to load referral details");
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLinkedInSearch = () => {
    if (currentReferral?.linkedinSearchLink) {
      window.open(currentReferral.linkedinSearchLink, "_blank");
    }
  };

  // Get template values from backend
  const shortTemplate = currentReferral?.templates?.["SHORT"] || 
    currentReferral?.templates?.["short"] || 
    `Hi [Name],\n\nI saw you're at ${currentReferral?.company || '[Company]'}. I'm applying for ${currentReferral?.role || '[Role]'} and would love to connect!\n\nBest,\n[Your Name]`;

  const professionalTemplate = currentReferral?.templates?.["PROFESSIONAL"] || 
    currentReferral?.templates?.["professional"] || 
    `Hello [Name],\n\nI noticed you work at ${currentReferral?.company || '[Company]'} and wanted to reach out regarding the ${currentReferral?.role || '[Position]'} I'm applying for.\n\nI'd appreciate any insights you could share about the team and role.\n\nThank you,\n[Your Name]`;

  const casualTemplate = currentReferral?.templates?.["CASUAL"] || 
    currentReferral?.templates?.["casual"] || 
    `Hey [Name]!\n\nI'm applying for ${currentReferral?.role || '[Role]'} at ${currentReferral?.company || '[Company]'} and would love to chat about your experience there.\n\nWould you be open to a quick coffee chat?\n\nCheers,\n[Your Name]`;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "#1a1d2e", margin: 0, letterSpacing: "-0.5px" }}>
            Referral Finder & Templates
          </h1>
          <p style={{ color: "#6b7280", marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
            Land your dream job by leveraging your network. Paste a job link below to<br />
            generate personalized outreach templates and find the right connections.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 12, padding: "12px 16px", marginBottom: 20,
            color: "#991b1b", fontSize: 14, display: "flex",
            alignItems: "center", gap: 8
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: "auto", background: "none", border: "none",
                color: "#991b1b", cursor: "pointer", fontSize: 18, padding: 0
              }}
            >×</button>
          </div>
        )}

        {/* Job Description Input Card */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #e8eaf0", marginBottom: 20
        }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>
            Job Description or LinkedIn URL
          </label>
          <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description or LinkedIn job URL here...&#10;&#10;Example: https://www.linkedin.com/jobs/view/3234567890&#10;&#10;Or paste the entire job description text including company name, role, requirements, etc."
              rows={8}
              style={{
                width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
                padding: "14px 16px", fontFamily: "inherit", fontSize: 13.5,
                color: "#374151", outline: "none", background: "#fafafa",
                resize: "vertical", lineHeight: 1.6,
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "#4F6EF7"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !jobDescription.trim()}
              style={{
                background: analyzing || !jobDescription.trim() ? "#a5b4fc" : "linear-gradient(135deg, #4F6EF7, #6366f1)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "13px 24px", fontFamily: "inherit", fontWeight: 600,
                fontSize: 14, cursor: analyzing || !jobDescription.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: analyzing || !jobDescription.trim() ? "none" : "0 2px 10px rgba(79,110,247,0.35)",
                transition: "all 0.2s", opacity: !jobDescription.trim() ? 0.6 : 1,
                width: "100%"
              }}
            >
              {analyzing ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  Analyzing Job & Finding Referrals...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Find Referrals & Generate Templates
                </>
              )}
            </button>
          </div>
        </div>

        {/* Job Card */}
        {detected && currentReferral && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e8eaf0", marginBottom: 20,
            animation: "fadeIn 0.4s ease"
          }}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80"
                alt="Company"
                style={{ width: 100, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: "#ecfdf5", color: "#059669",
                    fontSize: 11.5, fontWeight: 600, padding: "3px 9px",
                    borderRadius: 20, display: "flex", alignItems: "center", gap: 4
                  }}>
                    <span style={{ fontSize: 8 }}>●</span> Job Analyzed
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                  Company & Role
                </div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1d2e", letterSpacing: "-0.3px" }}>
                  {currentReferral.company || "Company"} — {currentReferral.role || "Role"}
                </h2>
                <div style={{ color: "#6b7280", fontSize: 13.5, marginTop: 8 }}>
                  Job description analyzed successfully
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button 
                onClick={handleLinkedInSearch}
                style={{
                  background: "linear-gradient(135deg, #0a66c2, #0073b1)",
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "10px 20px", fontFamily: "inherit",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 2px 10px rgba(10,102,194,0.3)",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="#fff"/>
                  <circle cx="4" cy="4" r="2" fill="#fff"/>
                </svg>
                Search Employees on LinkedIn
              </button>
              {currentReferral.shareLink && (
                <button 
                  onClick={() => handleCopy("shareLink", currentReferral.shareLink)}
                  style={{
                    background: copied === "shareLink" ? "#ecfdf5" : "#f9fafb",
                    border: `1.5px solid ${copied === "shareLink" ? "#6ee7b7" : "#e5e7eb"}`,
                    borderRadius: 10, padding: "10px 20px",
                    fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", color: copied === "shareLink" ? "#059669" : "#374151",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "all 0.2s"
                  }}
                >
                  {copied === "shareLink" ? (
                    <>
                      <span style={{ fontSize: 16 }}>✓</span>
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Copy Referral Link
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Outreach Templates */}
        {detected && currentReferral && (
          <div style={{ animation: "fadeIn 0.5s ease 0.1s both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1d2e", letterSpacing: "-0.3px" }}>
                Message Templates
              </h3>
              <div style={{
                background: "#f0f9ff", border: "1px solid #bae6fd",
                borderRadius: 8, padding: "6px 12px", fontSize: 12,
                color: "#0369a1", fontWeight: 600
              }}>
                3 Templates Generated
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
              {/* Short Template */}
              <TemplateCard
                icon="⚡"
                title="Short"
                body={shortTemplate}
                copied={copied === "short"}
                onCopy={() => handleCopy("short", shortTemplate)}
              />
              {/* Professional Template */}
              <TemplateCard
                icon="💼"
                title="Professional"
                body={professionalTemplate}
                copied={copied === "professional"}
                onCopy={() => handleCopy("professional", professionalTemplate)}
              />
              {/* Casual Template */}
              <TemplateCard
                icon="👋"
                title="Casual"
                body={casualTemplate}
                copied={copied === "casual"}
                onCopy={() => handleCopy("casual", casualTemplate)}
              />
            </div>
          </div>
        )}

        {/* Pro Tip */}
        {detected && (
          <div style={{
            marginTop: 20,
            background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
            border: "1px solid #fde68a",
            borderRadius: 12, padding: "14px 18px",
            display: "flex", alignItems: "flex-start", gap: 10,
            animation: "fadeIn 0.5s ease 0.2s both"
          }}>
            <span style={{
              background: "#f59e0b", color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "3px 8px",
              borderRadius: 6, flexShrink: 0, letterSpacing: "0.02em"
            }}>Pro Tip</span>
            <p style={{ margin: 0, color: "#92400e", fontSize: 13.5, lineHeight: 1.6 }}>
              Personalizing your message with a specific project the employee worked on increases your response rate by over <strong>45%</strong>. Check their recent LinkedIn activity before sending!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #e8eaf0", background: "#fff",
        padding: "20px 32px", display: "flex",
        justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ color: "#9ca3af", fontSize: 13 }}>© 2024 CareerFlow SaaS. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Help Center"].map(link => (
            <a key={link} href="#" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#4F6EF7")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
            >{link}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

function TemplateCard({ icon, title, body, copied, onCopy }: {
  icon: string; title: string; body: string;
  copied: boolean; onCopy: () => void;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #e8eaf0", display: "flex", flexDirection: "column"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1d2e" }}>{title}</span>
        </div>
        <button
          onClick={onCopy}
          style={{
            background: copied ? "#ecfdf5" : "#f9fafb",
            border: `1.5px solid ${copied ? "#6ee7b7" : "#e5e7eb"}`,
            borderRadius: 8, padding: "5px 12px",
            fontFamily: "inherit", fontSize: 12.5, fontWeight: 600,
            cursor: "pointer", color: copied ? "#059669" : "#374151",
            display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.2s"
          }}
        >
          {copied ? "✓ Copied!" : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div style={{
        flex: 1, background: "#fafafa", borderRadius: 10,
        padding: "14px 16px", border: "1px solid #f3f4f6"
      }}>
        <p style={{
          margin: 0, color: "#374151", fontSize: 13.5,
          lineHeight: 1.7, whiteSpace: "pre-line",
          display: "-webkit-box", WebkitLineClamp: 7,
          WebkitBoxOrient: "vertical", overflow: "hidden"
        } as React.CSSProperties}>{body}</p>
      </div>
    </div>
  );
}