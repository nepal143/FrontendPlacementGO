"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import { apiFetch, API_BASE_URL } from "@/lib/api";

// --- Types ---
interface JobDto {
  id: string;
  title: string;
  companyName: string;
  location: string;
  descriptionSnippet: string;
  applyUrl: string;
  jobPlatformSource: string;
  platformJobId: string;
  isInternal: boolean;
  postedAt: string;
}

interface ApplyResponse {
  success: boolean;
  message: string;
  status: string;
  redirectUrl: string;
  requiresExtension: boolean;
}

interface AppliedJob {
  id: string;
  title: string;
  company: string;
  status: "Success" | "Pending" | "Failed";
  time: string;
  color: string;
}

// --- Helpers ---
const LOGO_COLORS = ["#5E6AD2", "#FF5A5F", "#00A86B", "#F5A623", "#E535AB", "#0070F3", "#FF6B35", "#7C3AED"];

function getLogoColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "Recently posted";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PlacementGoPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  // Filter state
  const [roleCategory, setRoleCategory] = useState("Software Engineer");
  const [location, setLocation] = useState("Remote, NY, SF...");
  const [salary, setSalary] = useState("$120k - $180k");

  // Jobs state
  const [jobs, setJobs] = useState<JobDto[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");

  // Apply state
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobDto | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsError("");
    try {
      const query = roleCategory + (location !== "Remote, NY, SF..." ? ` ${location}` : "");
      const res = await apiFetch(
        `${API_BASE_URL}/api/v1/premium-jobs/search?query=${encodeURIComponent(query)}`
      );
      setJobs((res?.jobs as JobDto[]) ?? []);
    } catch {
      setJobsError("Failed to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, [roleCategory, location]);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      fetchJobs();
    }
  }, [loading, isLoggedIn, fetchJobs]);

  const handleApply = async (job: JobDto) => {
    if (appliedIds.has(job.platformJobId) || applyingId) return;
    setApplyingId(job.platformJobId);
    setApplyingJob(job);
    const color = getLogoColor(job.companyName);
    try {
      const res: ApplyResponse = await apiFetch(`${API_BASE_URL}/api/v1/premium-jobs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ externalJobDetails: job }),
      });
      if (res.requiresExtension && res.redirectUrl) {
        window.open(res.redirectUrl, "_blank", "noopener,noreferrer");
      }
      setAppliedJobs((prev) => [
        { id: job.platformJobId, title: job.title, company: `${job.companyName} • Auto-Applied`, status: res.success ? "Success" : "Pending", time: "Just now", color },
        ...prev,
      ].slice(0, 5));
      setAppliedIds((prev) => new Set([...prev, job.platformJobId]));
    } catch {
      setAppliedJobs((prev) => [
        { id: job.platformJobId, title: job.title, company: job.companyName, status: "Failed", time: "Just now", color },
        ...prev,
      ].slice(0, 5));
    } finally {
      setApplyingId(null);
      setApplyingJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .auto-apply-btn { background: linear-gradient(135deg, #1A56FF 0%, #0038CC 100%); }
        .card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        .card-hover:hover { box-shadow: 0 8px 32px rgba(26,86,255,0.10); transform: translateY(-1px); }
        .tag { background: #EEF2FF; color: #3B5BDB; border-radius: 99px; padding: 2px 10px; font-size: 12px; font-weight: 500; }
        .pill-success { background: #DCFCE7; color: #16A34A; border-radius: 99px; padding: 1px 10px; font-size: 11px; font-weight: 600; }
        .pill-pending { background: #FEF9C3; color: #CA8A04; border-radius: 99px; padding: 1px 10px; font-size: 11px; font-weight: 600; }
        .pill-failed { background: #FEE2E2; color: #DC2626; border-radius: 99px; padding: 1px 10px; font-size: 11px; font-weight: 600; }
        .premium-badge { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #7C4A00; border-radius: 99px; padding: 1px 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; }
        .insight-bar { background: linear-gradient(90deg, #1A56FF 0%, #A78BFA 100%); }
        .plan-card { background: linear-gradient(135deg, #0A1628 0%, #1A2A4A 100%); }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px !important; }
        @media (max-width: 768px) {
          .mobile-nav { display: flex !important; }
          .sidebar-col { display: none !important; }
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
        .mobile-nav { position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #E5E7EB; z-index: 50; padding: 8px 0 12px; justify-content: space-around; }
        .applying-bar { background: linear-gradient(90deg, #1A56FF 0%, #4A9EFF 100%); }
      `}</style>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Premium Job Postings</h1>
              <span className="premium-badge">PRO</span>
            </div>
            <p className="text-gray-500 text-sm">Access curated roles with high-match potential and AI-powered outreach automation.</p>
            <p className="text-gray-400 text-xs mt-0.5">Your personalized application engine is ready.</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 self-start shrink-0">
            <div className="text-right">
              <div className="text-xs text-gray-400 font-medium">JOBS FOUND</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-bold text-gray-800 mono">{jobsLoading ? "..." : jobs.length}</span>
                <span className="text-gray-400 text-sm">results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Role Category</label>
            <select
              value={roleCategory}
              onChange={(e) => setRoleCategory(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A56FF]/20 cursor-pointer"
            >
              <option>Software Engineer</option>
              <option>Product Design</option>
              <option>UX Research</option>
              <option>Product Management</option>
              <option>Data Scientist</option>
              <option>DevOps Engineer</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A56FF]/20 cursor-pointer"
            >
              <option>Remote, NY, SF...</option>
              <option>Remote Only</option>
              <option>New York, NY</option>
              <option>San Francisco, CA</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Salary Range</label>
            <select
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A56FF]/20 cursor-pointer"
            >
              <option>$120k - $180k</option>
              <option>$80k - $120k</option>
              <option>$180k - $250k</option>
              <option>$250k+</option>
            </select>
          </div>
          <button
            onClick={fetchJobs}
            disabled={jobsLoading}
            className="auto-apply-btn text-white text-sm font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60"
          >
            {jobsLoading ? "Searching..." : "⚡ Apply Filters"}
          </button>
        </div>

        {/* Applying Banner — visible only while auto-apply is in progress */}
        {applyingJob && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <span className="text-[#1A56FF] text-base">⚡</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-semibold text-gray-800 text-sm">Applying to {applyingJob.title}</span>
                <span className="text-gray-400 text-xs">{applyingJob.companyName} • {applyingJob.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="applying-bar h-1.5 rounded-full animate-pulse w-3/4"></div>
                </div>
                <span className="text-[#1A56FF] text-xs font-semibold whitespace-nowrap">Submitting...</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="main-grid grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* Left: Job Listings */}
          <div className="flex flex-col gap-4">
            {jobsLoading && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-[#1A56FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Searching for {roleCategory} roles...</span>
              </div>
            )}
            {!jobsLoading && jobsError && (
              <div className="bg-white rounded-2xl border border-red-100 p-6 text-center text-red-500 text-sm">
                {jobsError}
                <button onClick={fetchJobs} className="block mx-auto mt-2 text-[#1A56FF] underline text-xs">Retry</button>
              </div>
            )}
            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
                No jobs found for &quot;{roleCategory}&quot;. Try a different role or location.
              </div>
            )}
            {!jobsLoading && jobs.map((job) => {
              const logoColor = getLogoColor(job.companyName);
              const isApplied = appliedIds.has(job.platformJobId);
              const isApplying = applyingId === job.platformJobId;
              return (
                <div key={job.platformJobId} className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                      style={{ backgroundColor: logoColor }}
                    >
                      {job.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 text-gray-500 text-xs">
                        <span>{job.companyName}</span>
                        {job.location && <><span>•</span><span>{job.location}</span></>}
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs shrink-0 hidden sm:block">{timeAgo(job.postedAt)}</span>
                  </div>
                  {job.descriptionSnippet && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{job.descriptionSnippet}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="tag">{job.jobPlatformSource}</span>
                    {job.isInternal && <span className="tag">Internal</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleApply(job)}
                      disabled={isApplied || !!applyingId}
                      className={`text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity flex-1 sm:flex-none ${isApplied ? "bg-green-600 cursor-default" : "auto-apply-btn hover:opacity-90"} disabled:opacity-60`}
                    >
                      {isApplying ? "Applying..." : isApplied ? "✓ Applied" : "⚡ Auto-Apply"}
                    </button>
                    {job.applyUrl && (
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-1 sm:flex-none text-center no-underline"
                      >
                        🔗 View Job
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="sidebar-col flex flex-col gap-4">

            {/* Recently Applied */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-900 text-sm">Recently Applied</span>
              </div>
              <div className="flex flex-col gap-3">
                {appliedJobs.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-2">No applications yet. Use ⚡ Auto-Apply to get started.</p>
                ) : (
                  appliedJobs.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ backgroundColor: item.color + "22", color: item.color }}
                      >
                        {item.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">{item.title}</div>
                        <div className="text-gray-400 text-xs truncate">{item.company}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={
                          item.status === "Success" ? "pill-success" :
                          item.status === "Failed" ? "pill-failed" : "pill-pending"
                        }>
                          {item.status}
                        </span>
                        <span className="text-gray-400 text-[10px]">{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Application Insights */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="font-bold text-gray-900 text-sm mb-4">Application Insights</div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Profile Strength</span>
                  <span className="font-bold text-gray-800">84%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="insight-bar h-2 rounded-full" style={{ width: "84%" }}></div>
                </div>
              </div>
              <div className="bg-[#EEF2FF] rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                Your resume is highly optimized for{" "}
                <span className="text-[#1A56FF] font-semibold">{roleCategory}</span> roles. We recommend adding{" "}
                <span className="font-semibold">&quot;Systems Thinking&quot;</span> to reach 100%.
              </div>
            </div>

            {/* Plan Card */}
            <div className="plan-card rounded-2xl p-5">
              <div className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest mb-1">Current Plan</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg">Premium Pro</span>
              </div>
              <button className="w-full bg-[#1A56FF] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0038CC] transition-colors">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {[
          { icon: "🏠", label: "Dashboard" },
          { icon: "🔍", label: "Jobs" },
          { icon: "📋", label: "Applied" },
          { icon: "💬", label: "Messages" },
          { icon: "⚙️", label: "Settings" },
        ].map((item) => (
          <button key={item.label} className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#1A56FF] transition-colors px-3">
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between text-xs text-gray-400">
          <span>© 2024 PlacementGo. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
