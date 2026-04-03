"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

const DashboardIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h7v7H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 17h7v4H3z" />
  </svg>
);
const DocIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer",
      background: on ? "#3b5bdb" : "var(--pg-border)",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: "50%", background: "var(--pg-card)",
      position: "absolute", top: 3,
      left: on ? 23 : 3,
      transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
    }} />
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg }: { msg: string }) => (
  <>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      background: "#1a1d2e", color: "white", padding: "12px 22px",
      borderRadius: 10, fontSize: 13, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 300,
      animation: "fadeUp 0.25s ease", whiteSpace: "nowrap",
    }}>
      <CheckIcon /> {msg}
    </div>
  </>
);

// ─── Desktop Sidebar NavItem ──────────────────────────────────────────────────

const NavItem = ({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) => (
  <Link href={href} style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", margin: "1px 8px", borderRadius: 8,
    fontSize: 13.5, fontWeight: active ? 600 : 500,
    color: active ? "#3b5bdb" : "#7b8299",
    background: active ? "#eef2ff" : "transparent",
    textDecoration: "none", transition: "all 0.15s",
  }}>
    {icon}{label}
  </Link>
);

// ─── Mobile Section Tab ───────────────────────────────────────────────────────

const SectionTab = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px", borderRadius: 20, border: "none",
      background: active ? "#3b5bdb" : "var(--pg-chip)",
      color: active ? "white" : "#7b8299",
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
      transition: "all 0.15s",
    }}
  >{label}</button>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "var(--pg-card)", border: "1px solid var(--pg-border)",
    borderRadius: 14, padding: "20px 20px", marginBottom: 16, ...style,
  }}>
    {children}
  </div>
);

// ─── Setting Row ──────────────────────────────────────────────────────────────

const SettingRow = ({ label, sub, right, border = true }: { label: string; sub?: string; right: React.ReactNode; border?: boolean }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    paddingBottom: border ? 16 : 0, marginBottom: border ? 16 : 0,
    borderBottom: border ? "1px solid #f0f2f7" : "none",
    gap: 12,
  }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--pg-text)" }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--pg-muted)", marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
    </div>
    <div style={{ flexShrink: 0 }}>{right}</div>
  </div>
);

// ─── Input Style ──────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: 13,
  border: "1.5px solid var(--pg-border)", borderRadius: 8, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box", background: "var(--pg-card)", color: "var(--pg-text)",
};

// ─── Save Button ──────────────────────────────────────────────────────────────

const SaveBtn = ({ onClick, loading, label }: { onClick: () => void; loading: boolean; label: string }) => (
  <button onClick={onClick} disabled={loading} style={{
    marginTop: 18, padding: "11px 24px",
    background: loading ? "#748ffc" : "#3b5bdb",
    color: "white", border: "none", borderRadius: 10,
    fontSize: 13, fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "inherit", width: "100%",
  }}>
    {loading ? "Saving..." : label}
  </button>
);

// ─── Section: Profile ─────────────────────────────────────────────────────────

const ProfileSection = ({ userEmail, showToast }: { userEmail: string; showToast: (m: string) => void }) => {
  const [name, setName] = useState(userEmail?.split("@")[0] || "");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [saving, setSaving] = useState(false);
  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "U";

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // Replace with real API
    setSaving(false);
    showToast("Profile updated!");
  };

  return (
    <Card>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 18, borderBottom: "1px solid #f0f2f7" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 19, flexShrink: 0,
        }}>{userInitials}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{userEmail || "User"}</div>
          <div style={{ fontSize: 12, color: "var(--pg-muted)", marginTop: 2 }}>Student Plan · Free tier</div>
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "Display Name", val: name, set: setName, ph: "Your name" },
          { label: "College / University", val: college, set: setCollege, ph: "e.g. IIT Bombay" },
          { label: "Degree", val: degree, set: setDegree, ph: "e.g. B.Tech CSE" },
          { label: "Graduation Year", val: gradYear, set: setGradYear, ph: "e.g. 2026" },
        ].map(f => (
          <div key={f.label}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pg-label)", marginBottom: 5 }}>{f.label}</label>
            <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inputStyle} />
          </div>
        ))}
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pg-label)", marginBottom: 5 }}>Email</label>
          <input value={userEmail || ""} disabled style={{ ...inputStyle, background: "var(--pg-chip)", color: "var(--pg-muted)", cursor: "not-allowed" }} />
          <div style={{ fontSize: 11, color: "var(--pg-muted)", marginTop: 3 }}>Email cannot be changed.</div>
        </div>
      </div>
      <SaveBtn onClick={save} loading={saving} label="Save Profile" />
    </Card>
  );
};

// ─── Section: Goal ────────────────────────────────────────────────────────────

const GoalSection = ({ showToast }: { showToast: (m: string) => void }) => {
  const [goal, setGoal] = useState(() => {
    if (typeof window !== "undefined") return Number(localStorage.getItem("monthlyGoal") || 10);
    return 10;
  });

  const save = () => {
    localStorage.setItem("monthlyGoal", String(goal));
    showToast(`Goal set to ${goal} applications!`);
  };

  return (
    <Card>
      <div style={{ fontSize: 13, color: "var(--pg-muted)", marginBottom: 20, lineHeight: 1.5 }}>
        Set your monthly application target. Your dashboard progress bar uses this number.
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "8px 0 20px" }}>
        <button
          onClick={() => setGoal(g => Math.max(1, g - 1))}
          style={{
            width: 40, height: 40, borderRadius: 10, border: "1.5px solid var(--pg-border)",
            background: "var(--pg-card)", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pg-text)",
          }}
        >−</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#3b5bdb", lineHeight: 1 }}>{goal}</div>
          <div style={{ fontSize: 12, color: "var(--pg-muted)", marginTop: 4 }}>apps / month</div>
        </div>
        <button
          onClick={() => setGoal(g => Math.min(100, g + 1))}
          style={{
            width: 40, height: 40, borderRadius: 10, border: "1.5px solid var(--pg-border)",
            background: "var(--pg-card)", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pg-text)",
          }}
        >+</button>
      </div>
      {/* mini progress preview */}
      <div style={{ background: "var(--pg-bg)", borderRadius: 8, padding: "12px 14px", marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: "var(--pg-muted)", marginBottom: 6 }}>Preview in dashboard</div>
        <div style={{ height: 6, background: "var(--pg-border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "30%", background: "#3b5bdb", borderRadius: 10 }} />
        </div>
        <div style={{ fontSize: 11, color: "var(--pg-muted)", marginTop: 5 }}>3 of {goal} applications</div>
      </div>
      <SaveBtn onClick={save} loading={false} label="Save Goal" />
    </Card>
  );
};

// ─── Section: Notifications ───────────────────────────────────────────────────

const NotificationsSection = ({ showToast }: { showToast: (m: string) => void }) => {
  const [notifs, setNotifs] = useState({
    email: true, weekly: true, interview: true, offer: true,
  });
  const toggle = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));

  const rows = [
    { key: "email" as const, label: "Email Notifications", sub: "Receive important updates via email." },
    { key: "weekly" as const, label: "Weekly Summary", sub: "Job search recap every Monday." },
    { key: "interview" as const, label: "Interview Reminders", sub: "Reminders about upcoming interviews." },
    { key: "offer" as const, label: "Offer Alerts", sub: "Notify when application marked as Offer." },
  ];

  return (
    <Card>
      {rows.map((r, i) => (
        <SettingRow key={r.key} label={r.label} sub={r.sub} border={i < rows.length - 1}
          right={<Toggle on={notifs[r.key]} onChange={() => toggle(r.key)} />}
        />
      ))}
      <SaveBtn onClick={() => showToast("Notification preferences saved!")} loading={false} label="Save Preferences" />
    </Card>
  );
};

// ─── Section: Security ────────────────────────────────────────────────────────

const SecuritySection = ({ showToast }: { showToast: (m: string) => void }) => {
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setError("");
    if (!pw.current) return setError("Enter your current password.");
    if (pw.next.length < 8) return setError("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return setError("Passwords do not match.");
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // Replace with real API
    setSaving(false);
    setPw({ current: "", next: "", confirm: "" });
    showToast("Password changed successfully!");
  };

  return (
    <Card>
      {error && (
        <div style={{
          background: "#fff5f5", border: "1px solid #ffd0d0", borderRadius: 8,
          padding: "10px 14px", fontSize: 13, color: "#c92a2a", marginBottom: 14,
        }}>{error}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "Current Password", key: "current", ph: "Enter current password" },
          { label: "New Password", key: "next", ph: "Min. 8 characters" },
          { label: "Confirm New Password", key: "confirm", ph: "Repeat new password" },
        ].map(f => (
          <div key={f.key}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pg-label)", marginBottom: 5 }}>{f.label}</label>
            <input
              type="password" placeholder={f.ph}
              value={(pw as Record<string, string>)[f.key]}
              onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
              style={inputStyle}
            />
          </div>
        ))}
      </div>
      <SaveBtn onClick={save} loading={saving} label="Change Password" />
    </Card>
  );
};

// ─── Section: Danger ──────────────────────────────────────────────────────────

const DangerSection = ({ logout }: { logout: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  return (
    <>
      <Card style={{ border: "1px solid #ffd0d0" }}>
        <div style={{ fontSize: 13, color: "var(--pg-muted)", marginBottom: 14, lineHeight: 1.5 }}>
          Permanently delete your account and all data. This cannot be undone.
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            width: "100%", padding: "11px 0",
            background: "#fff5f5", color: "#e03131",
            border: "1.5px solid #ffd0d0", borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6,
          }}
        >
          <TrashIcon /> Delete My Account
        </button>
      </Card>

      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setConfirmText(""); } }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200, padding: 16,
          }}
        >
          <div style={{
            background: "var(--pg-card)", borderRadius: 16, padding: 24,
            width: "100%", maxWidth: 400,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#e03131", marginBottom: 8 }}>Delete Account?</div>
            <div style={{ fontSize: 13, color: "var(--pg-muted)", marginBottom: 18, lineHeight: 1.6 }}>
              This will permanently delete your account, all applications, and resumes. <strong>This cannot be undone.</strong>
            </div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--pg-label)", marginBottom: 6 }}>
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="DELETE"
              style={{ ...inputStyle, marginBottom: 18 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowModal(false); setConfirmText(""); }}
                style={{ flex: 1, padding: "11px 0", background: "var(--pg-bg)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >Cancel</button>
              <button
                disabled={confirmText !== "DELETE"}
                onClick={logout}
                style={{
                  flex: 1, padding: "11px 0",
                  background: confirmText === "DELETE" ? "#e03131" : "#f4a0a0",
                  color: "white", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 600,
                  cursor: confirmText === "DELETE" ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { logout, userEmail } = useAuth();
  const isMobile = useIsMobile();
  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "U";

  const [toast, setToast] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const sections = [
    { key: "profile", label: "Profile" },
    { key: "goal", label: "Goal" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "danger", label: "Danger" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile": return <ProfileSection userEmail={userEmail || ""} showToast={showToast} />;
      case "goal": return <GoalSection showToast={showToast} />;
      case "notifications": return <NotificationsSection showToast={showToast} />;
      case "security": return <SecuritySection showToast={showToast} />;
      case "danger": return <DangerSection logout={logout} />;
      default: return null;
    }
  };

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--pg-bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--pg-text)", paddingBottom: 80 }}>

        {/* Mobile Top Header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "var(--pg-card)", borderBottom: "1px solid var(--pg-border)",
          padding: "14px 16px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "var(--pg-text)" }}>Settings</span>
          </div>

          {/* Section Tabs — horizontal scroll */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
            {sections.map(s => (
              <SectionTab key={s.key} label={s.label} active={activeSection === s.key} onClick={() => setActiveSection(s.key)} />
            ))}
          </div>
        </div>

        {/* Section Title */}
        <div style={{ padding: "20px 16px 6px" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            {sections.find(s => s.key === activeSection)?.label}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--pg-muted)", marginTop: 2 }}>
            {activeSection === "profile" && "Update your personal information"}
            {activeSection === "goal" && "Set your monthly application target"}
            {activeSection === "notifications" && "Manage what updates you receive"}
            {activeSection === "security" && "Keep your account secure"}
            {activeSection === "danger" && "Irreversible actions — be careful"}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "12px 16px" }}>
          {renderSection()}
        </div>

        {/* Mobile Bottom Nav */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "var(--pg-card)", borderTop: "1px solid var(--pg-border)",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          padding: "8px 0 12px", zIndex: 100,
        }}>
          {[
            { href: "/dashboard", icon: <DashboardIcon />, label: "Home" },
            { href: "/resumeoptimizer", icon: <DocIcon />, label: "Resume" },
            { href: "/referalfinder", icon: <UsersIcon />, label: "Referral" },
            { href: "/interview", icon: <CalendarIcon />, label: "Interview" },
            { href: "/settings", icon: <SettingsIcon />, label: "Settings", active: true },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              textDecoration: "none",
              color: item.active ? "#3b5bdb" : "#7b8299",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: item.active ? "#eef2ff" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 10, fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
            </Link>
          ))}
        </div>

        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--pg-bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--pg-text)" }}>

      {/* Desktop Sidebar */}
      <aside style={{
        width: 220, background: "var(--pg-card)", borderRight: "1px solid #e8ecf4",
        display: "flex", flexDirection: "column", padding: "24px 0",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 28px", borderBottom: "1px solid var(--pg-border)" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🚀</div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>PlacementGo</span>
          </div>
        </Link>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--pg-muted)", padding: "20px 20px 8px" }}>Menu</span>
        <NavItem icon={<DashboardIcon />} label="Dashboard" href="/dashboard" />
        <NavItem icon={<DocIcon />} label="Resume Optimizer" href="/resumeoptimizer" />
        <NavItem icon={<UsersIcon />} label="Referral Finder" href="/referalfinder" />
        <NavItem icon={<CalendarIcon />} label="Interview Guide" href="/interview" />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--pg-muted)", padding: "20px 20px 8px" }}>Account</span>
        <NavItem icon={<SettingsIcon />} label="Settings" href="/settings" active />
        <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--pg-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>{userInitials}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userEmail || "User"}</div>
              <div style={{ fontSize: 11, color: "var(--pg-muted)" }}>Student Plan</div>
            </div>
          </div>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "#e03131", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 8, background: "none", border: "none", width: "100%", fontFamily: "inherit" }}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* Desktop Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 40px 60px", maxWidth: "calc(100vw - 220px)" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13.5, color: "var(--pg-muted)", marginTop: 4 }}>Manage your account, preferences, and notifications.</p>
        </div>

        {/* Desktop: two-col layout — left nav + right content */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, maxWidth: 820 }}>

          {/* Left: Section Nav */}
          <div style={{ position: "sticky", top: 32, alignSelf: "start" }}>
            {sections.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "10px 14px", marginBottom: 4,
                  borderRadius: 10, border: "none",
                  background: activeSection === s.key ? "#eef2ff" : "transparent",
                  color: activeSection === s.key ? "#3b5bdb" : "#7b8299",
                  fontSize: 13.5, fontWeight: activeSection === s.key ? 700 : 500,
                  cursor: "pointer", fontFamily: "inherit",
                  textAlign: "left", transition: "all 0.15s",
                }}
              >
                {s.label}
                {activeSection === s.key && <ChevronIcon />}
              </button>
            ))}
          </div>

          {/* Right: Active Section */}
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>
              {sections.find(s => s.key === activeSection)?.label}
            </div>
            <div style={{ fontSize: 13, color: "var(--pg-muted)", marginBottom: 18 }}>
              {activeSection === "profile" && "Update your personal and academic information."}
              {activeSection === "goal" && "Set your monthly application target to track progress."}
              {activeSection === "notifications" && "Choose what updates you want to receive."}
              {activeSection === "security" && "Update your password to keep your account safe."}
              {activeSection === "danger" && "Irreversible actions — proceed with caution."}
            </div>
            {renderSection()}
          </div>
        </div>
      </main>

      {toast && <Toast msg={toast} />}
    </div>
  );
}





