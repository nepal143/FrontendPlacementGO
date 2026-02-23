"use client";
import { useState } from "react";
import Link from "next/link";
// ─── Types ───────────────────────────────────────────────────────────────────

type StatusType = "applied" | "pending" | "interviewing" | "offer" | "rejected";
type FilterType = "all" | StatusType;

interface Application {
  id: number;
  company: string;
  logo: string;
  logoColor: string;
  position: string;
  status: StatusType;
  activity: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const APPLICATIONS: Application[] = [
  { id: 1, company: "Google", logo: "G", logoColor: "#4285f4", position: "Software Engineer Intern", status: "interviewing", activity: "2h ago" },
  { id: 2, company: "Stripe", logo: "S", logoColor: "#635bff", position: "Product Management Intern", status: "applied", activity: "1d ago" },
  { id: 3, company: "Airbnb", logo: "A", logoColor: "#ff5a5f", position: "Frontend Developer", status: "offer", activity: "3d ago" },
  { id: 4, company: "Meta", logo: "M", logoColor: "#ff6900", position: "Backend Intern", status: "rejected", activity: "5d ago" },
  { id: 5, company: "Netflix", logo: "N", logoColor: "#00b4d8", position: "Data Science Intern", status: "pending", activity: "6d ago" },
  { id: 6, company: "X (Twitter)", logo: "X", logoColor: "#000000", position: "iOS Developer", status: "applied", activity: "1w ago" },
  { id: 7, company: "LinkedIn", logo: "Li", logoColor: "#0077b5", position: "UX Designer", status: "interviewing", activity: "1w ago" },
];

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Pending", value: "pending" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  applied:      { label: "Applied",      bg: "#e7f5ff", text: "#1971c2", dot: "#1971c2" },
  pending:      { label: "Pending",      bg: "#f3f0ff", text: "#7048e8", dot: "#7048e8" },
  interviewing: { label: "Interviewing", bg: "#fff4e6", text: "#e67700", dot: "#e67700" },
  offer:        { label: "Offer",        bg: "#ebfbee", text: "#2f9e44", dot: "#2f9e44" },
  rejected:     { label: "Rejected",     bg: "#fff5f5", text: "#c92a2a", dot: "#c92a2a" },
};

const FILTER_ACTIVE_COLORS: Record<FilterType, string> = {
  all:          "#1a1d2e",
  applied:      "#1971c2",
  pending:      "#7048e8",
  interviewing: "#e67700",
  offer:        "#2f9e44",
  rejected:     "#c92a2a",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusPill = ({ status }: { status: StatusType }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.text,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};


const NavItem = ({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) => (
  <Link
    href={href}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      margin: "1px 8px",
      borderRadius: 8,
      fontSize: 13.5,
      fontWeight: active ? 600 : 500,
      color: active ? "#3b5bdb" : "#7b8299",
      background: active ? "#eef2ff" : "transparent",
      cursor: "pointer",
      transition: "all 0.15s",
      textDecoration: "none",
    }}
  >
    {icon}
    {label}
  </Link>
);

const StatCard = ({
  title, icon, iconBg, value, badge, badgeType, sub
}: {
  title: string; icon: string; iconBg: string;
  value: number | string; badge: string;
  badgeType: "up" | "down" | "neutral"; sub: string;
}) => {
  const badgeColors = {
    up:      { bg: "#ebfbee", color: "#2f9e44" },
    down:    { bg: "#fff5f5", color: "#c92a2a" },
    neutral: { bg: "#f1f3f5", color: "#495057" },
  };
  const bc = badgeColors[badgeType];
  return (
    <div style={{
      background: "white", border: "1px solid #e8ecf4", borderRadius: 14,
      padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#7b8299", fontWeight: 500 }}>
        {title}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 30, fontWeight: 800, color: "#1a1d2e" }}>
        {value}
        <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: bc.bg, color: bc.color }}>{badge}</span>
      </div>
      <div style={{ fontSize: 12, color: "#7b8299" }}>{sub}</div>
    </div>
  );
};

// ─── Icons (inline SVGs as components) ───────────────────────────────────────

const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const HelpIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

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

const ClipboardIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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

const UploadIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filtered = activeFilter === "all"
    ? APPLICATIONS
    : APPLICATIONS.filter(a => a.status === activeFilter);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'DM Sans', sans-serif", color: "#1a1d2e" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 220, background: "white", borderRight: "1px solid #e8ecf4",
        display: "flex", flexDirection: "column", padding: "24px 0",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        {/* Logo */}
       <Link href="/" className="flex items-center gap-2">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px 28px", borderBottom: "1px solid #e8ecf4" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🚀</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 15 }}>PlacementGo</span>
        </div>
        </Link>

        {/* Nav */}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#7b8299", padding: "20px 20px 8px" }}>Menu</span>
       <NavItem icon={<DashboardIcon />} label="Dashboard" href="/dashboard" active />
<NavItem icon={<DocIcon />} label="Resume Optimizer" href="/resumeoptimizer" />
<NavItem icon={<UsersIcon />} label="Referral Finder" href="/referalfinder" />
<NavItem icon={<CalendarIcon />} label="Interview Guide" href="/interviewguide" />

        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#7b8299", padding: "20px 20px 8px" }}>Account</span>
        <NavItem icon={<SettingsIcon />} label="Settings" href="/login" />

        {/* User */}
        <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid #e8ecf4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10, cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>AJ</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Alex Johnson</div>
              <div style={{ fontSize: 11, color: "#7b8299" }}>Student Plan</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "#e03131", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 8 }}>
            <LogoutIcon /> Logout
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 32px 40px", maxWidth: "calc(100vw - 220px)" }}>

        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", border: "1px solid #e8ecf4", borderRadius: 10,
            padding: "9px 14px", fontSize: 13.5, color: "#7b8299", maxWidth: 360, flex: 1,
          }}>
            <SearchIcon /> Search applications, companies...
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {[<BellIcon />, <HelpIcon />].map((icon, i) => (
              <div key={i} style={{
                width: 38, height: 38, borderRadius: 10, background: "white",
                border: "1px solid #e8ecf4", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "#7b8299",
              }}>{icon}</div>
            ))}
          </div>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: 4 }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800 }}>Good morning, Alex 👋</h1>
          <p style={{ fontSize: 13.5, color: "#7b8299", marginTop: 4 }}>Here's a summary of your career progress today.</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "24px 0" }}>
          <StatCard title="Total Applications" icon="📋" iconBg="#e7f5ff" value={42} badge="↑12%" badgeType="up" sub="vs. last 30 days" />
          <StatCard title="Interviewing" icon="🎥" iconBg="#ebfbee" value={8} badge="↑25%" badgeType="up" sub="Currently active pipelines" />
          <StatCard title="Offers Received" icon="🏆" iconBg="#f3f0ff" value={2} badge="0%" badgeType="neutral" sub="2 new offers pending review" />
        </div>

        {/* Two Col Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* LEFT */}
          <div>
            {/* Quick Actions */}
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { icon: <UploadIcon />,   label: "Upload CV",      href: "/resumeoptimizer" },
                { icon: <CheckIcon />,    label: "Log App",        href: "/applications/new" },
                { icon: <UsersIcon />,    label: "Find Referrals", href: "/referalfinder" },
                { icon: <CalendarIcon />, label: "Schedule",       href: "/interview" },
              ].map((qa) => (
                <Link key={qa.label} href={qa.href} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  background: "white", border: "1px solid #e8ecf4", borderRadius: 12,
                  padding: "16px 10px", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                  color: "#1a1d2e", textDecoration: "none", fontFamily: "inherit",
                }}>
                  {qa.icon}{qa.label}
                </Link>
              ))}
            </div>


            {/* Pipeline Card */}
            <div style={{ background: "white", border: "1px solid #e8ecf4", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #e8ecf4" }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700 }}>Active Pipeline</span>
                <span style={{ fontSize: 13, color: "#3b5bdb", fontWeight: 600, cursor: "pointer" }}>View all</span>
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid #e8ecf4", flexWrap: "wrap" }}>
                {FILTERS.map(f => {
                  const isActive = activeFilter === f.value;
                  const activeColor = FILTER_ACTIVE_COLORS[f.value];
                  return (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      style={{
                        padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                        border: isActive ? `1.5px solid ${activeColor}` : "1.5px solid transparent",
                        background: isActive ? activeColor : "#f4f6fb",
                        color: isActive ? "white" : "#7b8299",
                        fontFamily: "inherit",
                      }}
                    >
                      {f.label}
                      {f.value !== "all" && (
                        <span style={{
                          marginLeft: 5, background: isActive ? "rgba(255,255,255,0.25)" : "#e8ecf4",
                          padding: "1px 6px", borderRadius: 10, fontSize: 10,
                        }}>
                          {APPLICATIONS.filter(a => a.status === f.value).length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#7b8299", fontSize: 13.5 }}>
                    No applications found for this status.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#fafbfd", borderBottom: "1px solid #e8ecf4" }}>
                        {["Company", "Position", "Status", "Activity"].map(h => (
                          <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#7b8299", padding: "10px 20px" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((app, i) => (
                        <tr key={app.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #e8ecf4" : "none", cursor: "pointer" }}>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: app.logoColor, display: "flex", alignItems: "center",
                                justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0,
                              }}>{app.logo}</div>
                              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{app.company}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: 13 }}>{app.position}</td>
                          <td style={{ padding: "14px 20px" }}><StatusPill status={app.status} /></td>
                          <td style={{ padding: "14px 20px", fontSize: 12, color: "#7b8299" }}>{app.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recent Activity */}
            <div style={{ background: "white", border: "1px solid #e8ecf4", borderRadius: 14, padding: 18 }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Recent Activity</div>
              {[
                { dot: "✏️", dotBg: "#e7f5ff", text: <>You updated your <b>Software Engineer</b> resume.</>, time: "Today at 10:42 AM" },
                { dot: "✅", dotBg: "#ebfbee", text: <><b>Application to Microsoft</b> was successful.</>, time: "Yesterday at 4:15 PM" },
                { dot: "🔗", dotBg: "#f3f0ff", text: <>Referral request sent to <b>Sarah Miller at Google.</b></>, time: "Oct 24, 2023" },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #e8ecf4" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: item.dotBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
                    {item.dot}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: "#1a1d2e", lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: "#7b8299", marginTop: 3 }}>{item.time}</div>
                  </div>
                </div>
              ))}
              <button style={{ width: "100%", padding: 8, textAlign: "center", fontSize: 13, color: "#3b5bdb", fontWeight: 600, cursor: "pointer", border: "none", background: "none", marginTop: 6, fontFamily: "inherit" }}>
                Load More
              </button>
            </div>

            {/* Monthly Goal */}
            <div style={{ background: "linear-gradient(135deg, #3b5bdb, #4c6ef5, #748ffc)", borderRadius: 14, padding: 20, color: "white" }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Monthly Goal</div>
              <div style={{ fontSize: 12.5, opacity: 0.85, lineHeight: 1.5, marginBottom: 16 }}>
                Complete 10 interview prep modules to earn your certification.
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                <span>Progress</span><span>70%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ height: "100%", width: "70%", background: "white", borderRadius: 10 }} />
              </div>
              <button style={{
                width: "100%", padding: 10, background: "white", color: "#3b5bdb",
                border: "none", borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}>
                Continue Learning
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
