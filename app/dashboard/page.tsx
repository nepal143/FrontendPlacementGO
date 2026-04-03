"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useResumes } from "../../hooks/useResume";
import { getResumeDetail, deleteResume as deleteResumeApi } from "../../services/resume.service";

// ─── Types ───────────────────────────────────────────────────────────────────

type BackendStatus = "APPLIED" | "INTERVIEW" | "REJECTED" | "OFFER";
type StatusType = "applied" | "interviewing" | "offer" | "rejected";
type FilterType = "all" | StatusType;

interface ApiApplication {
  id: string;
  company: string;
  role: string;
  jobLink?: string;
  appliedDate?: string;
  status: BackendStatus;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_MAP: Record<BackendStatus, StatusType> = {
  APPLIED: "applied",
  INTERVIEW: "interviewing",
  REJECTED: "rejected",
  OFFER: "offer",
};

const REVERSE_STATUS_MAP: Record<StatusType, BackendStatus> = {
  applied: "APPLIED",
  interviewing: "INTERVIEW",
  rejected: "REJECTED",
  offer: "OFFER",
};

const LOGO_COLORS = [
  "#4285f4", "#635bff", "#ff5a5f", "#ff6900", "#00b4d8",
  "#000000", "#0077b5", "#e91e63", "#009688", "#ff9800",
];

function getLogoColor(company: string): string {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function mapApiApp(app: ApiApplication): Application {
  return {
    id: app.id,
    company: app.company,
    logo: app.company.slice(0, 2).toUpperCase(),
    logoColor: getLogoColor(app.company),
    position: app.role,
    status: STATUS_MAP[app.status] || "applied",
    activity: timeAgo(app.createdAt),
    jobLink: app.jobLink,
    appliedDate: app.appliedDate,
  };
}

interface Application {
  id: string;
  company: string;
  logo: string;
  logoColor: string;
  position: string;
  status: StatusType;
  activity: string;
  jobLink?: string;
  appliedDate?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  applied:      { label: "Applied",      bg: "#e7f5ff", text: "#1971c2", dot: "#1971c2" },
  interviewing: { label: "Interviewing", bg: "#fff4e6", text: "#e67700", dot: "#e67700" },
  offer:        { label: "Offer",        bg: "#ebfbee", text: "#2f9e44", dot: "#2f9e44" },
  rejected:     { label: "Rejected",     bg: "#fff5f5", text: "#c92a2a", dot: "#c92a2a" },
};

const FILTER_ACTIVE_COLORS: Record<FilterType, string> = {
  all:          "#1a1d2e",
  applied:      "#1971c2",
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
      color: active ? "#3b5bdb" : "var(--pg-muted)",
      background: active ? "var(--pg-nav-active)" : "transparent",
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
    neutral: { bg: "var(--pg-chip)", color: "var(--pg-neutral-text)" },
  };
  const bc = badgeColors[badgeType];
  return (
    <div style={{
      background: "var(--pg-card)", border: "1px solid var(--pg-border)", borderRadius: 14,
      padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--pg-muted)", fontWeight: 500 }}>
        {title}
        <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 30, fontWeight: 800, color: "var(--pg-text)" }}>
        {value}
        <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: bc.bg, color: bc.color }}>{badge}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--pg-muted)" }}>{sub}</div>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, logout, userEmail } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  // Add Application Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ company: "", role: "", jobLink: "", appliedDate: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit Application Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [editForm, setEditForm] = useState({ company: "", role: "", jobLink: "", appliedDate: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Status Update Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusApp, setStatusApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<StatusType>("applied");
  const [statusLoading, setStatusLoading] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingApp, setDeletingApp] = useState<Application | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Resumes
  const { resumes, loading: resumesLoading, refresh: refetchResumes } = useResumes();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);

  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "U";
  const greeting = userEmail ? userEmail.split("@")[0] : "there";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (authLoading) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchApplications();
  }, [authLoading]);

  // ─── API Functions ────────────────────────────────────────────────────────

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchApplications = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch applications");
      }
      
      const data: ApiApplication[] = await res.json();
      setApplications(data.map(mapApiApp));
    } catch (e) {
      console.error("Failed to load applications:", e);
      setAddError("Failed to load applications. Please try again.");
    } finally {
      setLoadingData(false);
    }
  };

  const addApplication = async () => {
    if (!addForm.company.trim() || !addForm.role.trim()) {
      setAddError("Company and role are required.");
      return;
    }
    
    setAddLoading(true);
    setAddError("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          company: addForm.company.trim(),
          role: addForm.role.trim(),
          jobLink: addForm.jobLink.trim() || null,
          appliedDate: addForm.appliedDate || null,
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add application");
      }
      
      const newApp: ApiApplication = await res.json();
      setApplications(prev => [mapApiApp(newApp), ...prev]);
      setAddForm({ company: "", role: "", jobLink: "", appliedDate: "" });
      setShowAddModal(false);
    } catch (e: any) {
      setAddError(e.message || "Failed to add application");
    } finally {
      setAddLoading(false);
    }
  };

  const updateApplication = async () => {
    if (!editingApp || !editForm.company.trim() || !editForm.role.trim()) {
      setEditError("Company and role are required.");
      return;
    }
    
    setEditLoading(true);
    setEditError("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${editingApp.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          company: editForm.company.trim(),
          role: editForm.role.trim(),
          jobLink: editForm.jobLink.trim() || null,
          appliedDate: editForm.appliedDate || null,
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update application");
      }
      
      const updated: ApiApplication = await res.json();
      setApplications(prev => prev.map(app => 
        app.id === editingApp.id ? mapApiApp(updated) : app
      ));
      setShowEditModal(false);
      setEditingApp(null);
    } catch (e: any) {
      setEditError(e.message || "Failed to update application");
    } finally {
      setEditLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!statusApp) return;
    
    setStatusLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${statusApp.id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: REVERSE_STATUS_MAP[newStatus],
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update status");
      }
      
      const updated: ApiApplication = await res.json();
      setApplications(prev => prev.map(app => 
        app.id === statusApp.id ? mapApiApp(updated) : app
      ));
      setShowStatusModal(false);
      setStatusApp(null);
    } catch (e: any) {
      console.error("Failed to update status:", e);
    } finally {
      setStatusLoading(false);
    }
  };

  const deleteApplication = async () => {
    if (!deletingApp) return;
    
    setDeleteLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/applications/${deletingApp.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete application");
      }
      
      setApplications(prev => prev.filter(app => app.id !== deletingApp.id));
      setShowDeleteModal(false);
      setDeletingApp(null);
    } catch (e: any) {
      console.error("Failed to delete application:", e);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Event Handlers ───────────────────────────────────────────────────────

  const handleEdit = (app: Application) => {
    setEditingApp(app);
    setEditForm({
      company: app.company,
      role: app.position,
      jobLink: app.jobLink || "",
      appliedDate: app.appliedDate || "",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleStatusChange = (app: Application) => {
    setStatusApp(app);
    setNewStatus(app.status);
    setShowStatusModal(true);
  };

  const handleDelete = (app: Application) => {
    setDeletingApp(app);
    setShowDeleteModal(true);
  };

  const handleRowClick = (app: Application, e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return;
    handleStatusChange(app);
  };

  // ─── Computed Values ──────────────────────────────────────────────────────

const filtered = (() => {
  let regex: RegExp | null = null;
  if (searchQuery.trim() !== "") {
    try {
      regex = new RegExp(searchQuery, "i");
    } catch {
      // Invalid regex — fall back to plain string match
      regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    }
  }

  return applications
    .filter(a => activeFilter === "all" || a.status === activeFilter)
    .filter(a => {
      if (!regex) return true;
      return regex.test(a.company) || regex.test(a.position);
    });
})();


  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === "interviewing").length,
    offers: applications.filter(a => a.status === "offer").length,
  };

  if (authLoading) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: var(--pg-bg), fontFamily: "'DM Sans', sans-serif", color: var(--pg-text) }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 220, background: var(--pg-card), borderRight: "1px solid var(--pg-border)",
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

        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: var(--pg-muted), padding: "20px 20px 8px" }}>Menu</span>
        <NavItem icon={<DashboardIcon />} label="Dashboard" href="/dashboard" active />
        <NavItem icon={<DocIcon />} label="Resume Optimizer" href="/resumeoptimizer" />
        <NavItem icon={<UsersIcon />} label="Referral Finder" href="/referalfinder" />
        <NavItem icon={<CalendarIcon />} label="Interview Guide" href="/interview" />

        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: var(--pg-muted), padding: "20px 20px 8px" }}>Account</span>
        <NavItem icon={<SettingsIcon />} label="Settings" href="/settings" />

        <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--pg-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b5bdb, #748ffc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>{userInitials}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: var(--pg-text) }}>
                {userEmail || "User"}
              </div>
              <div style={{ fontSize: 11, color: var(--pg-muted) }}>Student Plan</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", color: "#e03131", fontSize: 13, fontWeight: 500, cursor: "pointer", borderRadius: 8, background: "none", border: "none", width: "100%", fontFamily: "inherit" }}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 32px 40px", maxWidth: "calc(100vw - 220px)" }}>

        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 10,
            padding: "9px 14px", maxWidth: 360, flex: 1,
          }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search applications, companies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: "none", outline: "none", fontSize: 13.5, color: var(--pg-text),
                background: "transparent", flex: 1, fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#3b5bdb", color: "white", border: "none",
                borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <PlusIcon /> Add Application
            </button>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                width: 38, height: 38, borderRadius: 10, background: var(--pg-card),
                border: "1px solid var(--pg-border)", display: "flex", alignItems: "center",
                justifyContent: "center", color: var(--pg-muted),
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {isDark ? (
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <div style={{
              width: 38, height: 38, borderRadius: 10, background: var(--pg-card),
              border: "1px solid var(--pg-border)", display: "flex", alignItems: "center",
              justifyContent: "center", color: var(--pg-muted),
            }}><BellIcon /></div>
          </div>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Welcome Again, {greeting} 👋</h1>
          <p style={{ fontSize: 13.5, color: var(--pg-muted), marginTop: 4 }}>Here's a summary of your career progress today.</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "24px 0" }}>
          <StatCard title="Total Applications" icon="📋" iconBg="#e7f5ff" value={stats.total} badge={stats.total > 0 ? "active" : "none yet"} badgeType={stats.total > 0 ? "up" : "neutral"} sub="All tracked applications" />
          <StatCard title="Interviewing" icon="🎥" iconBg="#ebfbee" value={stats.interviewing} badge={stats.interviewing > 0 ? "active" : "none"} badgeType={stats.interviewing > 0 ? "up" : "neutral"} sub="Currently active pipelines" />
          <StatCard title="Offers Received" icon="🏆" iconBg="#f3f0ff" value={stats.offers} badge={stats.offers > 0 ? "🎉" : "keep going"} badgeType={stats.offers > 0 ? "up" : "neutral"} sub="Offers in your pipeline" />
        </div>

        {/* Two Col Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* LEFT */}
          <div>
            {/* Quick Actions */}
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: var(--pg-text) }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { icon: <UploadIcon />, label: "Upload CV", href: "/resumeoptimizer" },
                { icon: <CheckIcon />, label: "Log App", onClick: () => setShowAddModal(true) },
                { icon: <UsersIcon />, label: "Find Referrals", href: "/referalfinder" },
                { icon: <CalendarIcon />, label: "Interview Prep", href: "/interview" },
              ].map((qa) =>
                "href" in qa ? (
                  <Link key={qa.label} href={qa.href!} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 12,
                    padding: "16px 10px", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                    color: var(--pg-text), textDecoration: "none", fontFamily: "inherit",
                  }}>
                    {qa.icon}{qa.label}
                  </Link>
                ) : (
                  <button key={qa.label} onClick={qa.onClick} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 12,
                    padding: "16px 10px", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
                    color: var(--pg-text), fontFamily: "inherit",
                  }}>
                    {qa.icon}{qa.label}
                  </button>
                )
              )}
            </div>

            {/* Pipeline Card */}
            <div style={{ background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid var(--pg-border)" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: var(--pg-text) }}>Active Pipeline</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  style={{ fontSize: 13, color: "#3b5bdb", fontWeight: 600, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
                >
                  + Add new
                </button>
              </div>

              {/* Status Filter Chips */}
              <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid var(--pg-border)", flexWrap: "wrap" }}>
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
                        background: isActive ? activeColor : var(--pg-chip),
                        color: isActive ? "white" : var(--pg-muted),
                        fontFamily: "inherit",
                      }}
                    >
                      {f.label}
                      {f.value !== "all" && (
                        <span style={{
                          marginLeft: 5, background: isActive ? "rgba(255,255,255,0.25)" : "var(--pg-border)",
                          padding: "1px 6px", borderRadius: 10, fontSize: 10,
                        }}>
                          {applications.filter(a => a.status === f.value).length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                {loadingData ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: var(--pg-muted), fontSize: 13.5 }}>
                    Loading your applications...
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: var(--pg-muted), fontSize: 13.5 }}>
                    {applications.length === 0
                      ? "No applications yet — add your first one above!"
                      : "No applications found for this status."}
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: var(--pg-table-hdr), borderBottom: "1px solid var(--pg-border)" }}>
                        {["Company", "Position", "Status", "Added", "Actions"].map(h => (
                          <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: var(--pg-muted), padding: "10px 20px" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((app, i) => (
                        <tr 
                          key={app.id} 
                          onClick={(e) => handleRowClick(app, e)}
                          style={{ 
                            borderBottom: i < filtered.length - 1 ? "1px solid var(--pg-border)" : "none", 
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = var(--pg-table-hdr)}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: app.logoColor, display: "flex", alignItems: "center",
                                justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13, flexShrink: 0,
                              }}>{app.logo}</div>
                              <span style={{ fontWeight: 600, fontSize: 13.5, color: var(--pg-text) }}>{app.company}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: 13, color: var(--pg-text) }}>{app.position}</td>
                          <td style={{ padding: "14px 20px" }}><StatusPill status={app.status} /></td>
                          <td style={{ padding: "14px 20px", fontSize: 12, color: var(--pg-muted) }}>
                            {app.appliedDate
                              ? new Date(app.appliedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                              : app.activity}
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                              {app.jobLink && (
                                <a
                                  href={app.jobLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    padding: "6px 10px", borderRadius: 6, border: "1px solid var(--pg-border)",
                                    background: var(--pg-card), cursor: "pointer", display: "flex", alignItems: "center",
                                    gap: 4, fontSize: 12, fontWeight: 500, color: "#2e7d32", textDecoration: "none",
                                  }}
                                  title="View Job Posting"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                  </svg>
                                </a>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(app); }}
                                style={{
                                  padding: "6px 10px", borderRadius: 6, border: "1px solid var(--pg-border)",
                                  background: var(--pg-card), cursor: "pointer", display: "flex", alignItems: "center",
                                  gap: 4, fontSize: 12, fontWeight: 500, color: "#3b5bdb", fontFamily: "inherit",
                                }}
                                title="Edit"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(app); }}
                                style={{
                                  padding: "6px 10px", borderRadius: 6, border: "1px solid var(--pg-border)",
                                  background: var(--pg-card), cursor: "pointer", display: "flex", alignItems: "center",
                                  gap: 4, fontSize: 12, fontWeight: 500, color: "#e03131", fontFamily: "inherit",
                                }}
                                title="Delete"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
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

            {/* Status Breakdown */}
            <div style={{ background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: var(--pg-text) }}>Status Breakdown</div>
              {FILTERS.filter(f => f.value !== "all").map(f => {
                const count = applications.filter(a => a.status === f.value).length;
                const pct = applications.length > 0 ? Math.round((count / applications.length) * 100) : 0;
                const color = FILTER_ACTIVE_COLORS[f.value];
                return (
                  <div key={f.value} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 500, marginBottom: 4 }}>
                      <span>{f.label}</span>
                      <span style={{ color: var(--pg-muted) }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: var(--pg-chip), borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 10, transition: "width 0.4s" }} />
                    </div>
                  </div>
                );
              })}
              {applications.length === 0 && (
                <div style={{ fontSize: 12, color: var(--pg-muted), textAlign: "center", paddingTop: 4 }}>
                  Add applications to see your breakdown
                </div>
              )}
            </div>

            {/* Monthly Goal */}
            <div style={{ background: "linear-gradient(135deg, #3b5bdb, #4c6ef5, #748ffc)", borderRadius: 14, padding: 20, color: "white" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Goal: 10 Applications</div>
              <div style={{ fontSize: 12.5, opacity: 0.85, lineHeight: 1.5, marginBottom: 16 }}>
                Track your progress towards your monthly application target.
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                <span>Progress</span>
                <span>{Math.min(100, Math.round((stats.total / 10) * 100))}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ height: "100%", width: `${Math.min(100, (stats.total / 10) * 100)}%`, background: "white", borderRadius: 10 }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{stats.total} of 10 applications</div>
            </div>

          </div>
        </div>

        {/* ── MY RESUMES ── */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: var(--pg-text) }}>My Optimized Resumes</span>
            <Link href="/resumeoptimizer" style={{ fontSize: 13, color: "#3b5bdb", fontWeight: 600, textDecoration: "none" }}>+ Generate new</Link>
          </div>

          {resumesLoading ? (
            <div style={{ fontSize: 13, color: var(--pg-muted), textAlign: "center", padding: "32px 0" }}>Loading resumes...</div>
          ) : resumes.length === 0 ? (
            <div style={{
              background: var(--pg-card), border: "1.5px dashed var(--pg-border)", borderRadius: 14,
              padding: "36px 24px", textAlign: "center", color: var(--pg-muted), fontSize: 13,
            }}>
              No optimized resumes yet —{" "}
              <Link href="/resumeoptimizer" style={{ color: "#3b5bdb", fontWeight: 600, textDecoration: "none" }}>generate one now</Link>.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {resumes.slice(0, 6).map((r) => (
                <div key={r.id} style={{
                  background: var(--pg-card), border: "1px solid var(--pg-border)", borderRadius: 14,
                  padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b5bdb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 600, color: var(--pg-text), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.originalFileName || "resume"}
                      </span>
                    </div>
                    <span style={{
                      flexShrink: 0, fontSize: 11, fontWeight: 600, padding: "2px 8px",
                      borderRadius: 20, background: "#e7f5ff", color: "#1971c2",
                    }}>{r.templateName ?? "classic"}</span>
                  </div>
                  <p style={{ fontSize: 12, color: var(--pg-muted), lineHeight: 1.5, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>
                    {r.jobDescriptionSnippet || "No job description."}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--pg-border)", paddingTop: 10, marginTop: "auto" }}>
                    <span style={{ fontSize: 11, color: var(--pg-muted) }}>
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        disabled={downloadingId === r.id}
                        onClick={async () => {
                          setDownloadingId(r.id);
                          try {
                            const detail = await getResumeDetail(r.id);
                            const binary = atob(detail.pdfBase64);
                            const arr = new Uint8Array(binary.length);
                            for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
                            const blob = new Blob([arr], { type: "application/pdf" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url; a.download = `optimized-${r.originalFileName || "resume"}.pdf`;
                            a.click(); URL.revokeObjectURL(url);
                          } catch { /* ignore */ } finally { setDownloadingId(null); }
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 12, fontWeight: 600, color: downloadingId === r.id ? "#adb5bd" : "#3b5bdb",
                          background: "none", border: "none", cursor: downloadingId === r.id ? "not-allowed" : "pointer",
                          fontFamily: "inherit", padding: 0,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        {downloadingId === r.id ? "..." : "Download"}
                      </button>
                      <button
                        disabled={deletingResumeId === r.id}
                        onClick={async () => {
                          if (!confirm(`Delete "${r.originalFileName || "resume"}"?`)) return;
                          setDeletingResumeId(r.id);
                          try {
                            await deleteResumeApi(r.id);
                            refetchResumes?.();
                          } catch { /* ignore */ } finally { setDeletingResumeId(null); }
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 12, fontWeight: 600, color: deletingResumeId === r.id ? "#adb5bd" : "#e03131",
                          background: "none", border: "none", cursor: deletingResumeId === r.id ? "not-allowed" : "pointer",
                          fontFamily: "inherit", padding: 0,
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {resumes.length > 6 && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Link href="/resumeoptimizer" style={{ fontSize: 13, color: "#3b5bdb", fontWeight: 600, textDecoration: "none" }}>
                View all {resumes.length} resumes →
              </Link>
            </div>
          )}
        </div>

      </main>

      {/* ── ADD APPLICATION MODAL ── */}
      {showAddModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setShowAddModal(false); setAddError(""); } }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
        >
          <div style={{
            background: var(--pg-card), borderRadius: 16, padding: 28, width: 440, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: var(--pg-text) }}>Log New Application</div>

            {addError && (
              <div style={{ background: "#fff5f5", border: "1px solid #ffd0d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c92a2a", marginBottom: 16 }}>
                {addError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Company *", key: "company", placeholder: "e.g. Google", type: "text" },
                { label: "Role *", key: "role", placeholder: "e.g. Software Engineer Intern", type: "text" },
                { label: "Job Link", key: "jobLink", placeholder: "https://...", type: "url" },
                { label: "Applied Date", key: "appliedDate", placeholder: "", type: "date" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: var(--pg-label), marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(addForm as Record<string, string>)[field.key]}
               
min={field.type === "date" ? "2026-01-01" : undefined}
max={field.type === "date" ? "2099-12-31" : undefined}
                    onChange={e => setAddForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "10px 14px", fontSize: 13, border: "1.5px solid var(--pg-border)",
                      borderRadius: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                      background: var(--pg-input), color: var(--pg-text),
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                onClick={() => { setShowAddModal(false); setAddError(""); setAddForm({ company: "", role: "", jobLink: "", appliedDate: "" }); }}
                style={{ flex: 1, padding: "11px 0", background: var(--pg-chip), border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: var(--pg-text) }}
              >
                Cancel
              </button>
              <button
                onClick={addApplication}
                disabled={addLoading}
                style={{ flex: 2, padding: "11px 0", background: "#3b5bdb", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: addLoading ? 0.7 : 1 }}
              >
                {addLoading ? "Saving..." : "Save Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT APPLICATION MODAL ── */}
      {showEditModal && editingApp && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setShowEditModal(false); setEditError(""); } }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
        >
          <div style={{
            background: var(--pg-card), borderRadius: 16, padding: 28, width: 440, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: var(--pg-text) }}>Edit Application</div>

            {editError && (
              <div style={{ background: "#fff5f5", border: "1px solid #ffd0d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#c92a2a", marginBottom: 16 }}>
                {editError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Company *", key: "company", placeholder: "e.g. Google", type: "text" },
                { label: "Role *", key: "role", placeholder: "e.g. Software Engineer Intern", type: "text" },
                { label: "Job Link", key: "jobLink", placeholder: "https://...", type: "url" },
                { label: "Applied Date", key: "appliedDate", placeholder: "", type: "date" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: var(--pg-label), marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={(editForm as Record<string, string>)[field.key]}
                  min={field.type === "date" ? "2026-01-01" : undefined}
max={field.type === "date" ? "2099-12-31" : undefined}
                    onChange={e => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "10px 14px", fontSize: 13, border: "1.5px solid var(--pg-border)",
                      borderRadius: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                      background: var(--pg-input), color: var(--pg-text),
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button
                onClick={() => { setShowEditModal(false); setEditError(""); }}
                style={{ flex: 1, padding: "11px 0", background: var(--pg-chip), border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: var(--pg-text) }}
              >
                Cancel
              </button>
              <button
                onClick={updateApplication}
                disabled={editLoading}
                style={{ flex: 2, padding: "11px 0", background: "#3b5bdb", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: editLoading ? 0.7 : 1 }}
              >
                {editLoading ? "Updating..." : "Update Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STATUS UPDATE MODAL ── */}
      {showStatusModal && statusApp && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowStatusModal(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
        >
          <div style={{
            background: var(--pg-card), borderRadius: 16, padding: 28, width: 400, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: var(--pg-text) }}>Update Status</div>
            <div style={{ fontSize: 13, color: var(--pg-muted), marginBottom: 20 }}>
              {statusApp.company} - {statusApp.position}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {(["applied", "interviewing", "offer", "rejected"] as StatusType[]).map(status => (
                <button
                  key={status}
                  onClick={() => setNewStatus(status)}
                  style={{
                    padding: "12px 16px", borderRadius: 10, border: `2px solid ${newStatus === status ? FILTER_ACTIVE_COLORS[status] : "var(--pg-border)"}`,
                    background: newStatus === status ? `${FILTER_ACTIVE_COLORS[status]}10` : var(--pg-input),
                    cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left",
                    color: newStatus === status ? FILTER_ACTIVE_COLORS[status] : var(--pg-text),
                    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${newStatus === status ? FILTER_ACTIVE_COLORS[status] : "#d0d5dd"}`,
                    background: newStatus === status ? FILTER_ACTIVE_COLORS[status] : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {newStatus === status && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                  </div>
                  {STATUS_CONFIG[status].label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{ flex: 1, padding: "11px 0", background: var(--pg-chip), border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: var(--pg-text) }}
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                disabled={statusLoading || newStatus === statusApp.status}
                style={{ 
                  flex: 2, padding: "11px 0", 
                  background: newStatus === statusApp.status ? "#d0d5dd" : "#3b5bdb", 
                  color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, 
                  cursor: newStatus === statusApp.status ? "not-allowed" : "pointer", 
                  fontFamily: "inherit", 
                  opacity: statusLoading ? 0.7 : 1 
                }}
              >
                {statusLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteModal && deletingApp && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
        >
          <div style={{
            background: var(--pg-card), borderRadius: 16, padding: 28, width: 400, maxWidth: "90vw",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#e03131" }}>Delete Application?</div>
            <div style={{ fontSize: 13, color: var(--pg-muted), marginBottom: 20, lineHeight: 1.5 }}>
              Are you sure you want to delete your application to <strong>{deletingApp.company}</strong> for <strong>{deletingApp.position}</strong>? This action cannot be undone.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: "11px 0", background: var(--pg-chip), border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: var(--pg-text) }}
              >
                Cancel
              </button>
              <button
                onClick={deleteApplication}
                disabled={deleteLoading}
                style={{ flex: 1, padding: "11px 0", background: "#e03131", color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: deleteLoading ? 0.7 : 1 }}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}