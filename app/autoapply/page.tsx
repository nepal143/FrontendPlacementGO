"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useAutoApply } from "../../hooks/useAutoApply";
import type { JobLeadDto, AutoApplyConfig, ApplicationTemplate } from "../../types/autoapply.types";
import UpgradeModal, { useSubscription } from "../component/UpgradeModal";

// ── helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 55) return "text-amber-500 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

function scoreBg(score: number) {
  if (score >= 75) return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (score >= 55) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING_REVIEW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    MANUAL_REQUIRED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    EMAIL_SENT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    AUTO_APPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    MANUALLY_APPLIED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    SKIPPED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500",
    FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return map[status] ?? "bg-slate-100 text-slate-700";
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING_REVIEW: "Pending",
    MANUAL_REQUIRED: "Apply Manually",
    EMAIL_SENT: "Email Sent",
    AUTO_APPLIED: "Auto Applied",
    MANUALLY_APPLIED: "Applied",
    SKIPPED: "Skipped",
    FAILED: "Failed",
  };
  return map[status] ?? status;
}

function applyMethodLabel(method: string) {
  const map: Record<string, string> = {
    EMAIL: "Email apply",
    EASY_APPLY_FORM: "Quick form",
    EXTERNAL_FORM: "External site",
    UNKNOWN: "Visit site",
  };
  return map[method] ?? method;
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function parseTemplate(json?: string): ApplicationTemplate | null {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

function parseReasons(json?: string): string[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function TemplateModal({ lead, onClose }: { lead: JobLeadDto; onClose: () => void }) {
  const tpl = parseTemplate(lead.applicationTemplate);
  const [copied, setCopied] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">
              Application Template
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {lead.jobTitle} · {lead.company}
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {tpl ? (
            <>
              {/* Email subject */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Email Subject
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {tpl.subject}
                  </div>
                  <button onClick={() => copy(tpl.subject)}
                    className="shrink-0 text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Pre-filled fields */}
              {tpl.fields && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Form Fields (Copy-Paste Ready)
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {Object.entries(tpl.fields).map(([k, v]) => v ? (
                      <div key={k} className="bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400 mb-1 capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium break-all">{v}</div>
                      </div>
                    ) : null)}
                  </div>
                </div>
              )}

              {/* Cover letter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Cover Letter
                  </label>
                  <button onClick={() => copy(tpl.coverLetter)}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                    {copied ? "Copied!" : "Copy All"}
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
                  {tpl.coverLetter}
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Template not yet generated.</p>
          )}

          {/* Apply button */}
          {lead.applyUrl && (
            <a href={lead.applyUrl} target="_blank" rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
              Open Application Page →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadCard({ lead, onApply, onSkip, onOpen, onRegenTemplate }:
  { lead: JobLeadDto; onApply: () => void; onSkip: () => void; onOpen: () => void; onRegenTemplate: () => void }) {
  const reasons = parseReasons(lead.matchReasons);
  const isActionable = lead.status === "PENDING_REVIEW" || lead.status === "MANUAL_REQUIRED";

  // Detect if template fields are empty (no resume data was used)
  let templateHasResume = false;
  try {
    if (lead.applicationTemplate) {
      const t = JSON.parse(lead.applicationTemplate);
      templateHasResume = !!(t?.fields?.fullName || t?.fields?.email);
    }
  } catch { /* ignore */ }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border p-5 transition hover:shadow-md ${scoreBg(lead.aiMatchScore)}`}>
      <div className="flex items-start gap-3">
        {/* Logo initial */}
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
            {lead.company?.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lead.jobTitle}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(lead.status)}`}>
              {statusLabel(lead.status)}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lead.company} · {lead.location}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`text-sm font-bold ${scoreColor(lead.aiMatchScore)}`}>
              {lead.aiMatchScore}% match
            </span>
            <span className="text-xs text-slate-400">{applyMethodLabel(lead.applyMethod)}</span>
            <span className="text-xs text-slate-400">{lead.source}</span>
            <span className="text-xs text-slate-400">{timeAgo(lead.discoveredAt)}</span>
          </div>

          {reasons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {reasons.slice(0, 2).map((r, i) => (
                <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button onClick={onOpen}
          className="flex-1 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          {lead.status === "MANUAL_REQUIRED" ? "View Template" : "View Details"}
        </button>
        {isActionable && (
          <>
            <button onClick={onApply}
              className="text-sm border border-emerald-500 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition font-medium">
              Mark Applied
            </button>
            <button onClick={onSkip}
              className="text-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
              Skip
            </button>
          </>
        )}
        {!templateHasResume && (
          <button onClick={onRegenTemplate} title="Update template with your latest resume"
            className="text-xs border border-amber-400 text-amber-600 dark:text-amber-400 px-2 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition">
            ↺ Update Template
          </button>
        )}
      </div>
    </div>
  );
}

// ── Config Panel ──────────────────────────────────────────────────────────────

function ConfigPanel({ config, onSave, saving }: {
  config: AutoApplyConfig | null;
  onSave: (c: Partial<AutoApplyConfig>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<AutoApplyConfig>>({
    targetJobTitles: [],
    preferredLocations: [],
    blacklistedCompanies: [],
    experienceLevel: "Any",
    autoApplyEnabled: false,
    emailApplyEnabled: true,
    maxApplicationsPerDay: 20,
    minAiMatchScore: 60,
    ...config,
  });
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    if (config) setForm(c => ({ ...c, ...config }));
  }, [config]);

  function addTitle() {
    const v = titleInput.trim();
    if (!v) return;
    setForm(f => ({ ...f, targetJobTitles: [...(f.targetJobTitles ?? []), v] }));
    setTitleInput("");
  }
  function removeTitle(t: string) {
    setForm(f => ({ ...f, targetJobTitles: (f.targetJobTitles ?? []).filter(x => x !== t) }));
  }
  function addLocation() {
    const v = locationInput.trim();
    if (!v) return;
    setForm(f => ({ ...f, preferredLocations: [...(f.preferredLocations ?? []), v] }));
    setLocationInput("");
  }
  function removeLocation(l: string) {
    setForm(f => ({ ...f, preferredLocations: (f.preferredLocations ?? []).filter(x => x !== l) }));
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
      <h2 className="font-bold text-slate-900 dark:text-white text-base">Job Preferences</h2>

      {/* Target job titles */}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Target Job Titles
        </label>
        <div className="flex gap-2 mt-1.5">
          <input value={titleInput} onChange={e => setTitleInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTitle()}
            placeholder="e.g. Backend Engineer"
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={addTitle}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(form.targetJobTitles ?? []).map(t => (
            <span key={t} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              {t}
              <button onClick={() => removeTitle(t)} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Preferred Locations
        </label>
        <div className="flex gap-2 mt-1.5">
          <input value={locationInput} onChange={e => setLocationInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addLocation()}
            placeholder="e.g. Remote, Bangalore"
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={addLocation}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(form.preferredLocations ?? []).map(l => (
            <span key={l} className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {l}
              <button onClick={() => removeLocation(l)} className="ml-1 opacity-60 hover:opacity-100">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Toggles row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Experience Level
          </label>
          <select value={form.experienceLevel ?? "Any"}
            onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}
            className="mt-1.5 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Any</option>
            <option>Entry</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Min. AI Match Score
          </label>
          <input type="number" min={0} max={100} value={form.minAiMatchScore ?? 60}
            onChange={e => setForm(f => ({ ...f, minAiMatchScore: +e.target.value }))}
            className="mt-1.5 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Max Applications / Day
          </label>
          <input type="number" min={1} max={50} value={form.maxApplicationsPerDay ?? 20}
            onChange={e => setForm(f => ({ ...f, maxApplicationsPerDay: +e.target.value }))}
            className="mt-1.5 w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Switches */}
      <div className="space-y-3">
        <Toggle label="Auto-Apply (scheduled every 6 h)" sublabel="Automatically find and apply to jobs on your behalf"
          value={form.autoApplyEnabled ?? false}
          onChange={v => setForm(f => ({ ...f, autoApplyEnabled: v }))} />
        <Toggle label="Email Auto-Apply" sublabel="Send resume via email when a job provides an apply@ address"
          value={form.emailApplyEnabled ?? true}
          onChange={v => setForm(f => ({ ...f, emailApplyEnabled: v }))} />
      </div>

      <button onClick={() => onSave(form)} disabled={saving}
        className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50">
        {saving ? "Saving…" : "Save Preferences"}
      </button>
    </div>
  );
}

function Toggle({ label, sublabel, value, onChange }:
  { label: string; sublabel: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start gap-3">
      <button onClick={() => onChange(!value)} role="switch" aria-checked={value}
        className={`relative shrink-0 mt-0.5 w-10 h-6 rounded-full transition-colors ${value ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-4" : ""}`} />
      </button>
      <div>
        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AutoApplyPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const {
    config, stats, leadsPage, notifications, unreadCount,
    scanning, savingConfig, error,
    updateConfig, scan, applyToLead, skipALead, regenTemplate, loadMoreLeads, markAllRead,
    page,
  } = useAutoApply();

  const [activeTab, setActiveTab] = useState<"leads" | "config" | "notifications">("leads");
  const [selectedLead, setSelectedLead] = useState<JobLeadDto | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { status: subStatus, refresh: refreshSub } = useSubscription();

  if (!isLoggedIn) {
    router.replace("/login");
    return null;
  }

  const leads = leadsPage?.content ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job Automation</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              AI finds matching jobs, generates templates, and applies where possible.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button onClick={() => { setShowNotifs(!showNotifs); setActiveTab("notifications"); }}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Scan now */}
            <button onClick={scan} disabled={scanning}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {scanning ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Scanning…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  Scan Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Upgrade to PRO banner (non-premium users) */}
        {!subStatus.isPremium && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">⚡</span>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Unlock unlimited Job Automation with PRO</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Get unlimited scans, AI match scoring, auto-apply &amp; real-time alerts — only ₹499/month
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="shrink-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
            >
              Upgrade to PRO →
            </button>
          </div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <StatCard label="Pending" value={stats.pending} color="text-slate-700 dark:text-slate-300" />
            <StatCard label="Need Action" value={stats.manualRequired} color="text-amber-600 dark:text-amber-400" />
            <StatCard label="Auto Applied" value={stats.autoApplied} color="text-blue-600 dark:text-blue-400" />
            <StatCard label="Manually Applied" value={stats.manuallyApplied} color="text-emerald-600 dark:text-emerald-400" />
            <StatCard label="Skipped" value={stats.skipped} color="text-slate-500 dark:text-slate-400" />
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 w-fit">
          {(["leads", "config", "notifications"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}>
              {tab === "notifications" && unreadCount > 0
                ? `Notifications (${unreadCount})`
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Leads tab ──────────────────────────────────────────────────────── */}
        {activeTab === "leads" && (
          <div>
            {leads.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium">No job leads yet</p>
                <p className="text-sm mt-1">Configure your preferences, then click <strong>Scan Now</strong></p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {leads.map(lead => (
                  <LeadCard key={lead.id} lead={lead}
                    onApply={() => applyToLead(lead.id)}
                    onSkip={() => skipALead(lead.id)}
                    onOpen={() => setSelectedLead(lead)}
                    onRegenTemplate={() => regenTemplate(lead.id)} />
                ))}
              </div>
            )}
            {/* Pagination */}
            {leadsPage && leadsPage.totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                {page > 0 && (
                  <button onClick={() => loadMoreLeads(page - 1)}
                    className="text-sm border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    ← Previous
                  </button>
                )}
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  Page {page + 1} of {leadsPage.totalPages}
                </span>
                {page + 1 < leadsPage.totalPages && (
                  <button onClick={() => loadMoreLeads(page + 1)}
                    className="text-sm border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    Next →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Config tab ─────────────────────────────────────────────────────── */}
        {activeTab === "config" && (
          <div className="max-w-xl">
            <ConfigPanel config={config} onSave={updateConfig} saving={savingConfig} />

            {/* API key guidance */}
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-400 text-sm mb-2">
                Optional: Connect Job APIs for More Results
              </h3>
              <ul className="text-xs text-amber-700 dark:text-amber-500 space-y-1 list-disc list-inside">
                <li><strong>JSearch (RapidAPI)</strong> – Set env var <code>JSEARCH_API_KEY</code>. 
                    Covers LinkedIn, Indeed, Glassdoor &amp; more.</li>
                <li><strong>Adzuna</strong> – Set <code>ADZUNA_APP_ID</code> + <code>ADZUNA_APP_KEY</code>. 
                    Free tier: 250 req/day.</li>
                <li>Without keys, <strong>Remotive.com</strong> is used as a free fallback (remote jobs only).</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── Notifications tab ──────────────────────────────────────────────── */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white">Activity</h2>
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                <div className="text-4xl mb-3">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(n => {
                  const iconMap: Record<string, string> = {
                    JOB_FOUND: "🔍",
                    EMAIL_SENT: "📧",
                    AUTO_APPLIED: "✅",
                    MANUAL_REQUIRED: "📋",
                    APPLY_FAILED: "❌",
                    DAILY_SUMMARY: "📊",
                  };
                  const meta = n.metadata ? (() => {
                    try { return JSON.parse(n.metadata!); } catch { return {}; }
                  })() : {};
                  return (
                    <div key={n.id}
                      className={`flex gap-3 p-4 rounded-xl border transition ${
                        n.isRead
                          ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                      }`}>
                      <div className="text-xl shrink-0">{iconMap[n.type] ?? "🔔"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</p>
                          <span className="text-xs text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                        {meta.jobLeadId && (
                          <button onClick={() => {
                            const lead = leads.find(l => l.id === meta.jobLeadId);
                            if (lead) { setSelectedLead(lead); setActiveTab("leads"); }
                          }}
                            className="mt-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            View job lead →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template modal */}
      {selectedLead && (
        <TemplateModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => { refreshSub(); setShowUpgradeModal(false); }}
      />
    </div>
  );
}
