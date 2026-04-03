"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function ApplicationsTracker() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Statuses");

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.push("/login");
  }, [authLoading, isLoggedIn]);

  if (authLoading || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[var(--pg-bg)] text-[var(--pg-text)] font-sans selection:bg-blue-100">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[var(--pg-card)] border-b border-[var(--pg-border)] sticky top-0 z-50">
        <Navbar />
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-3 tracking-tight">
              Job Applications
            </h1>
            <p className="text-[var(--pg-muted)] font-medium max-w-xl">
              Track and manage your placement process across all companies in
              one centralized dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[var(--pg-card)] border border-[var(--pg-border)] rounded-2xl p-4 flex gap-8 shadow-sm">
              <div>
                <p className="text-[10px] font-black text-[var(--pg-muted)] uppercase tracking-widest mb-1">
                  Active
                </p>
                <p className="text-xl font-black text-blue-600">24</p>
              </div>
              <div className="w-px h-8 bg-[var(--pg-chip)] self-center" />
              <div>
                <p className="text-[10px] font-black text-[var(--pg-muted)] uppercase tracking-widest mb-1">
                  Interviews
                </p>
                <p className="text-xl font-black text-orange-500">5</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
              <Plus size={20} />
              Add Application
            </button>
          </div>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="bg-[var(--pg-card)] rounded-[2rem] border border-[var(--pg-border)] shadow-sm overflow-hidden">
          {/* Table Filters */}
          <div className="p-6 border-b border-[var(--pg-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex bg-[var(--pg-chip)] p-1 rounded-xl">
              {["All Statuses", "Applied", "Interview", "Offer"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[var(--pg-card)] text-blue-600 shadow-sm"
                      : "text-[var(--pg-muted)] hover:text-[var(--pg-text)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--pg-muted)] border border-[var(--pg-border)] rounded-xl hover:bg-[var(--pg-chip)]">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[var(--pg-muted)] border border-[var(--pg-border)] rounded-xl hover:bg-[var(--pg-chip)]">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-[var(--pg-muted)] uppercase tracking-[0.2em] border-b border-[var(--pg-border)]">
                  <th className="px-8 py-4">Company</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Date Applied</th>
                  <th className="px-8 py-4">Resume Version</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Referral</th>
                  <th className="px-8 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <ApplicationRow
                  company="Stripe"
                  logo="S"
                  role="Software Engineer Intern"
                  date="Oct 12, 2023"
                  resume="v2.1_Standard"
                  status="Applied"
                  referral="Confirmed"
                />
                <ApplicationRow
                  company="Google"
                  logo="G"
                  role="UX Design Associate"
                  date="Oct 15, 2023"
                  resume="v1.4_Creative"
                  status="Interview"
                  referral="None"
                />
                <ApplicationRow
                  company="Airbnb"
                  logo="A"
                  role="Product Analyst"
                  date="Sep 28, 2023"
                  resume="v3.0_Analytic"
                  status="Offer"
                  referral="Requested"
                />
                <ApplicationRow
                  company="Uber"
                  logo="U"
                  role="Software Developer"
                  date="Sep 20, 2023"
                  resume="v1.2_General"
                  status="Rejected"
                  referral="None"
                />
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
            <p className="text-xs font-bold text-[var(--pg-muted)]">
              Showing 4 of 24 applications
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-[var(--pg-border)] rounded-lg text-[var(--pg-muted)] hover:bg-[var(--pg-card)] transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 border border-[var(--pg-border)] rounded-lg text-[var(--pg-muted)] hover:bg-[var(--pg-card)] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ApplicationRow({
  company,
  logo,
  role,
  date,
  resume,
  status,
  referral,
}: any) {
  const statusStyles: any = {
    Applied: "bg-blue-50 text-blue-600 border-blue-100",
    Interview: "bg-orange-50 text-orange-600 border-orange-100",
    Offer: "bg-green-50 text-green-600 border-green-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
  };

  const referralStyles: any = {
    Confirmed: "text-green-600",
    Requested: "text-blue-500",
    None: "text-slate-300",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center font-bold text-sm">
            {logo}
          </div>
          <span className="font-bold text-[var(--pg-text)]">{company}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <p className="text-sm font-bold text-[var(--pg-text)]">{role}</p>
      </td>
      <td className="px-8 py-5">
        <p className="text-xs font-medium text-[var(--pg-muted)]">{date}</p>
      </td>
      <td className="px-8 py-5">
        <span className="bg-[var(--pg-chip)] border border-[var(--pg-border)] text-[var(--pg-muted)] px-3 py-1 rounded-lg text-[10px] font-bold">
          {resume}
        </span>
      </td>
      <td className="px-8 py-5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${statusStyles[status]}`}
        >
          {status === "Interview" && (
            <div className="w-1 h-1 bg-orange-500 rounded-full animate-ping" />
          )}
          {status}
        </div>
      </td>
      <td className="px-8 py-5">
        <div
          className={`flex items-center gap-2 text-xs font-bold ${referralStyles[referral]}`}
        >
          {referral === "Confirmed" ? (
            <CheckCircle2 size={14} />
          ) : referral === "Requested" ? (
            <Clock size={14} />
          ) : (
            <XCircle size={14} />
          )}
          {referral}
        </div>
      </td>
      <td className="px-8 py-5 text-center">
        <button className="text-[var(--pg-muted)] hover:text-[var(--pg-muted)] p-2 hover:bg-[var(--pg-card)] hover:shadow-sm rounded-lg transition-all">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}
