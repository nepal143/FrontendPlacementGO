"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";

interface CreateReferralResponse {
  referralId: string;
  shareLink: string;
  linkedinSearchLink: string;
  templates: Record<string, string>;
  company: string;
  role: string;
}

const API_BASE_URL = "http://localhost:8080";

export default function ReferralFinder() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<CreateReferralResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const handleFind = async () => {
    if (!company.trim() || !role.trim()) {
      setError("Please enter both company name and job role");
      return;
    }
    setAnalyzing(true);
    setError(null);
    setReferralData(null);

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication required. Please log in again.");
        setAnalyzing(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/referrals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ company: company.trim(), role: role.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      const data: CreateReferralResponse = await response.json();
      setReferralData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setReferralData(null);
    setCompany("");
    setRole("");
    setError(null);
  };

  const templates = referralData
    ? [
        { id: "FIRST_OUTREACH", icon: "👋", title: "First Outreach", body: referralData.templates["FIRST_OUTREACH"] ?? "" },
        { id: "REFERRAL_REQUEST", icon: "🤝", title: "Referral Request", body: referralData.templates["REFERRAL_REQUEST"] ?? "" },
        { id: "FOLLOW_UP", icon: "📩", title: "Follow-up", body: referralData.templates["FOLLOW_UP"] ?? "" },
      ]
    : [];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f5f6fa" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: "#1a1d2e", margin: 0, letterSpacing: "-0.5px" }}>
            Referral Finder & Templates
          </h1>
          <p style={{ color: "#6b7280", marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
            Enter the company and role — get a LinkedIn search link and 3 ready-to-send outreach templates.
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 12, padding: "12px 16px", marginBottom: 20,
            color: "#991b1b", fontSize: 14, display: "flex", alignItems: "center", gap: 8
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{ marginLeft: "auto", background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: 18, padding: 0 }}
            >
              ×
            </button>
          </div>
        )}

        {!referralData ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e8eaf0", marginBottom: 20
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Google, Microsoft, Flipkart"
                  style={{
                    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
                    padding: "13px 16px", fontFamily: "inherit", fontSize: 13.5,
                    color: "#374151", outline: "none", background: "#fafafa",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={e => { e.target.style.borderColor = "#4F6EF7"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                  Job Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Product Manager"
                  onKeyDown={e => { if (e.key === "Enter") handleFind(); }}
                  style={{
                    width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 10,
                    padding: "13px 16px", fontFamily: "inherit", fontSize: 13.5,
                    color: "#374151", outline: "none", background: "#fafafa",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={e => { e.target.style.borderColor = "#4F6EF7"; }}
                  onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}
                />
              </div>

              <button
                onClick={handleFind}
                disabled={analyzing || !company.trim() || !role.trim()}
                style={{
                  background: analyzing || !company.trim() || !role.trim() ? "#a5b4fc" : "linear-gradient(135deg, #4F6EF7, #6366f1)",
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "13px 24px", fontFamily: "inherit", fontWeight: 600,
                  fontSize: 14, cursor: analyzing ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 2px 10px rgba(79,110,247,0.35)", transition: "all 0.2s"
                }}
              >
                {analyzing ? "Finding Referrals..." : "Find Referrals & Templates"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.4s ease" }}>

            {/* Job Info Banner */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0",
              marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Searching for
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#1a1d2e" }}>
                  {referralData.role}{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>at</span>{" "}
                  {referralData.company}
                </p>
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8,
                  padding: "7px 14px", fontFamily: "inherit", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", color: "#6b7280"
                }}
              >
                Change
              </button>
            </div>

            {/* LinkedIn Card */}
            <div style={{
              background: "linear-gradient(135deg, #0a66c2, #0073b1)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}>
              <div>
                <p style={{ margin: 0, color: "#bfdbfe", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Step 1
                </p>
                <p style={{ margin: "4px 0 2px", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                  Find people to reach out to
                </p>
                <p style={{ margin: 0, color: "#93c5fd", fontSize: 13 }}>
                  Search {referralData.role}s at {referralData.company} on LinkedIn
                </p>
              </div>
              <a
                href={referralData.linkedinSearchLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flexShrink: 0,
                  background: "#fff",
                  color: "#0a66c2",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "10px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                Search LinkedIn ↗
              </a>
            </div>

            {/* Templates */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Step 2 — Copy a Template
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {templates.map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: "#fff", borderRadius: 14, padding: 20,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e8eaf0"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 16 }}>{t.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1d2e" }}>{t.title}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(t.id, t.body)}
                        style={{
                          background: copied === t.id ? "#ecfdf5" : "#f9fafb",
                          border: `1.5px solid ${copied === t.id ? "#6ee7b7" : "#e5e7eb"}`,
                          borderRadius: 8, padding: "5px 12px", fontFamily: "inherit",
                          fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                          color: copied === t.id ? "#059669" : "#374151",
                          display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s"
                        }}
                      >
                        {copied === t.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre style={{
                      margin: 0, color: "#374151", fontSize: 13.5,
                      lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit",
                      background: "#fafafa", borderRadius: 10,
                      padding: "14px 16px", border: "1px solid #f3f4f6"
                    }}>
                      {t.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div style={{
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px",
              display: "flex", alignItems: "flex-start", gap: 10
            }}>
              <span style={{
                background: "#f59e0b", color: "#fff", fontSize: 11,
                fontWeight: 700, padding: "3px 8px", borderRadius: 6, flexShrink: 0
              }}>
                Pro Tip
              </span>
              <p style={{ margin: 0, color: "#92400e", fontSize: 13.5, lineHeight: 1.6 }}>
                Personalizing your message with a specific project the employee worked on increases your response rate by over{" "}
                <strong>45%</strong>. Check their recent LinkedIn activity before sending!
              </p>
            </div>

          </div>
        )}
      </main>

      <footer style={{
        borderTop: "1px solid #e8eaf0", background: "#fff",
        padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ color: "#9ca3af", fontSize: 13 }}>© 2024 PlacementGo. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Help Center"].map(link => (
            <a key={link} href="#" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}>
              {link}
            </a>
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
