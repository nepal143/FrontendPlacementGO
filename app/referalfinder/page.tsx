"use client";

import { useState } from "react";
import Navbar from "../component/Navbar";
const mockJobData = {
  company: "Google",
  role: "Senior Frontend Engineer",
  location: "Mountain View, CA",
  type: "Full-time",
  mode: "Hybrid",
  skills: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
};

const firstConnectionTemplate = `Hi [Name],

I noticed your work as a Senior Engineer at Google and was impressed by your recent contributions to the Material Design library.

I'm currently applying for the Senior Frontend Engineer role and would love to ask a couple of questions about the team culture and day-to-day work.

Would you be open to a quick 15-minute chat? I'd really appreciate any insights you could share.

Best,
[Your Name]`;

const followUpTemplate = `Hi [Name],

I wanted to follow up on my previous message. I've officially submitted my application for the Senior Frontend Engineer position (Job ID: 812345).

I'm still very excited about the possibility of joining the team. If you're still comfortable providing a referral, please let me know and I'll send over any information you might need.

Thank you so much for your time!

Best,
[Your Name]`;

export default function ReferralFinder() {
  const [url, setUrl] = useState("https://www.linkedin.com/jobs/view/senior-frontend-engineer-at-google");
  const [detected, setDetected] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("referrals");

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDetected(true);
    }, 1200);
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

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

        {/* URL Input Card */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #e8eaf0", marginBottom: 20
        }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>
            Job Description or LinkedIn URL
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              border: "1.5px solid #e5e7eb", borderRadius: 10,
              padding: "0 14px", background: "#fafafa",
              transition: "border-color 0.2s"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8, flexShrink: 0, color: "#9ca3af" }}>
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste LinkedIn job URL or job description..."
                style={{
                  flex: 1, border: "none", background: "none",
                  fontFamily: "inherit", fontSize: 13.5, color: "#374151",
                  outline: "none", padding: "13px 0",
                }}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                background: analyzing ? "#a5b4fc" : "linear-gradient(135deg, #4F6EF7, #6366f1)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "0 22px", fontFamily: "inherit", fontWeight: 600,
                fontSize: 14, cursor: analyzing ? "wait" : "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: analyzing ? "none" : "0 2px 10px rgba(79,110,247,0.35)",
                transition: "all 0.2s", whiteSpace: "nowrap"
              }}
            >
              {analyzing ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Job Card */}
        {detected && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #e8eaf0", marginBottom: 20,
            animation: "fadeIn 0.4s ease"
          }}>
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <img
                src={mockJobData.image}
                alt="Google office"
                style={{ width: 100, height: 72, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: "#ecfdf5", color: "#059669",
                    fontSize: 11.5, fontWeight: 600, padding: "3px 9px",
                    borderRadius: 20, display: "flex", alignItems: "center", gap: 4
                  }}>
                    <span style={{ fontSize: 8 }}>●</span> Detected
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                  Company & Role
                </div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1d2e", letterSpacing: "-0.3px" }}>
                  {mockJobData.company} — {mockJobData.role}
                </h2>
                <div style={{ color: "#6b7280", fontSize: 13.5, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#9ca3af" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="#9ca3af" strokeWidth="2"/></svg>
                  {mockJobData.location} • {mockJobData.type} • {mockJobData.mode}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                  {mockJobData.skills.map(skill => (
                    <span key={skill} style={{
                      background: "#f3f4f6", color: "#374151",
                      fontSize: 12, fontWeight: 500, padding: "4px 10px",
                      borderRadius: 6, border: "1px solid #e5e7eb"
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <button style={{
                background: "linear-gradient(135deg, #0a66c2, #0073b1)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 20px", fontFamily: "inherit",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 2px 10px rgba(10,102,194,0.3)"
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                Search Referrals on LinkedIn
              </button>
            </div>
          </div>
        )}

        {/* Outreach Templates */}
        {detected && (
          <div style={{ animation: "fadeIn 0.5s ease 0.1s both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1d2e", letterSpacing: "-0.3px" }}>
                Outreach Templates
              </h3>
              <button style={{
                background: "none", border: "1.5px solid #e5e7eb", borderRadius: 8,
                padding: "7px 14px", fontFamily: "inherit", fontSize: 13,
                fontWeight: 600, cursor: "pointer", color: "#4F6EF7",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s"
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f0f4ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <span>↻</span> Regenerate AI Drafts
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* First Connection */}
              <TemplateCard
                icon="👤"
                title="First Connection"
                body={firstConnectionTemplate}
                copied={copied === "first"}
                onCopy={() => handleCopy("first", firstConnectionTemplate)}
              />
              {/* Follow-up */}
              <TemplateCard
                icon="↩️"
                title="Follow-up Message"
                body={followUpTemplate}
                copied={copied === "followup"}
                onCopy={() => handleCopy("followup", followUpTemplate)}
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
