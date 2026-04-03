import { ImageResponse } from "next/og";

export const alt = "Job Description Analyzer — PlacementGO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)", padding: "60px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: 52, height: 52, background: "#2563EB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 30 }}>P</span>
          </div>
          <span style={{ color: "#94A3B8", fontWeight: 600, fontSize: 24 }}>PlacementGO</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <h1 style={{ color: "white", fontSize: 74, fontWeight: 900, lineHeight: 1.05, margin: 0, letterSpacing: "-2px" }}>
            Job Description{"\n"}
            <span style={{ color: "#60A5FA" }}>Analyzer</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 27, marginTop: 24, marginBottom: 0, maxWidth: 700 }}>
            Paste any job listing. Instantly extract must-have skills, keywords, and insider tips to tailor your application perfectly.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
            {["Skills Extraction", "Keyword Mapping", "Tailored Tips", "LinkedIn JDs"].map((f) => (
              <div key={f} style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)", color: "#93C5FD", padding: "8px 18px", borderRadius: 99, fontSize: 18, fontWeight: 600 }}>{f}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24 }}>
          <span style={{ color: "#475569", fontSize: 22 }}>placementgo.in/finder</span>
          <span style={{ background: "#2563EB", color: "white", padding: "10px 28px", borderRadius: 99, fontSize: 20, fontWeight: 700 }}>Analyze Free →</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
