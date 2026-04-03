import { ImageResponse } from "next/og";

export const alt = "PlacementGO — AI Career Platform for Students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0F172A 0%, #1e3a8a 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#2563EB",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 30 }}>P</span>
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 30, letterSpacing: "-0.5px" }}>
            PlacementGO
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <h1
            style={{
              color: "white",
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 860,
              letterSpacing: "-2px",
            }}
          >
            Optimize. Connect.{"\n"}
            <span style={{ color: "#60A5FA" }}>Land the Job.</span>
          </h1>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 28,
              marginTop: 24,
              marginBottom: 0,
              maxWidth: 640,
            }}
          >
            AI-powered career platform trusted by 10,000+ students worldwide.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            {["Resume Optimizer", "Referral Finder", "Interview Coach", "Job Tracker"].map(
              (feature) => (
                <div
                  key={feature}
                  style={{
                    background: "rgba(37,99,235,0.25)",
                    border: "1px solid rgba(96,165,250,0.3)",
                    color: "#93C5FD",
                    padding: "10px 22px",
                    borderRadius: 99,
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {feature}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <span style={{ color: "#475569", fontSize: 22, fontWeight: 500 }}>
            placementgo.in
          </span>
          <span
            style={{
              background: "#2563EB",
              color: "white",
              padding: "10px 28px",
              borderRadius: 99,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Free Forever →
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
