"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import {
  Link as LinkIcon,
  Search,
  Copy,
  RefreshCw,
  Check,
  Linkedin,
  MapPin,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";

export default function ReferralFinder() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-100">
        {/* --- HEADER --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <Navbar />
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        {/* --- PAGE TITLE --- */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-3 tracking-tight">
            Referral Finder & Templates
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            Land your dream job by leveraging your network. Paste a job link
            below to generate personalized outreach templates.
          </p>
        </div>

        {/* --- INPUT SECTION --- */}
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm mb-10 group hover:shadow-xl hover:shadow-blue-50/50 transition-all">
          <label className="block text-sm font-black text-slate-700 mb-4 uppercase tracking-widest">
            Job Description or LinkedIn URL
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <LinkIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                defaultValue="https://www.linkedin.com/jobs/view/senior-frontend-engineer-at-google"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <button className="bg-[#2563EB] text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
              <Sparkles size={18} />
              Analyze
            </button>
          </div>
        </div>

        {/* --- DETECTED JOB CARD --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12 flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
              className="w-full h-full object-cover grayscale-[0.2]"
              alt="Office"
            />
            <div className="absolute inset-0 bg-blue-600/10" />
          </div>
          <div className="p-10 flex-1">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 mb-6">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Detected
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">
              Company & Role
            </p>
            <h2 className="text-3xl font-black mb-4">
              Google — Senior Frontend Engineer
            </h2>

            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-bold mb-8">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> Mountain View, CA
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> Full-time • Hybrid
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {["React", "TypeScript", "GraphQL", "Tailwind CSS"].map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              <Linkedin size={20} className="fill-current" />
              Search Referrals on LinkedIn
            </button>
          </div>
        </div>

        {/* --- TEMPLATES SECTION --- */}
        <div className="mb-8 flex justify-between items-end">
          <h3 className="text-2xl font-black">Outreach Templates</h3>
          <button className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:underline">
            <RefreshCw size={14} /> Regenerate AI Drafts
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <TemplateCard
            id="t1"
            title="First Connection"
            content="Hi [Name],\n\nI noticed your work as a Senior Engineer at Google and was impressed by your recent contributions to the Material Design library.\n\nI'm currently applying for the Senior Frontend Engineer role and would love to ask a couple of questions about the team culture if you have a moment."
            onCopy={handleCopy}
            isCopied={copied === "t1"}
          />
          <TemplateCard
            id="t2"
            title="Follow-up Message"
            content="Hi [Name],\n\nI wanted to follow up on my previous message. I've officially submitted my application for the Senior Frontend Engineer position (Job ID: #12345).\n\nI'm still very excited about the possibility of joining the team. If you're still comfortable providing a referral, please let me know!"
            onCopy={handleCopy}
            isCopied={copied === "t2"}
          />
        </div>

        {/* --- PRO TIP BAR --- */}
        <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] p-6 flex gap-4 items-start">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Info size={20} />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-black text-blue-700 uppercase tracking-widest text-[10px] block mb-1">
              Pro Tip
            </span>
            Personalizing your message with a specific project the employee
            worked on increases your response rate by over{" "}
            <span className="font-bold text-blue-600">45%</span>. Check their
            recent LinkedIn activity before sending!
          </p>
        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
          <p className="text-slate-400 text-xs font-medium">
            © 2024 PlacementGo Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <button className="hover:text-blue-600">Privacy Policy</button>
            <button className="hover:text-blue-600">Terms of Service</button>
            <button className="hover:text-blue-600">Help Center</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TemplateCard({ id, title, content, onCopy, isCopied }: any) {
  return (
    <div className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm flex flex-col hover:border-blue-200 transition-all">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            {id === "t1" ? <Users size={18} /> : <MessageSquare size={18} />}
          </div>
          <h4 className="font-bold">{title}</h4>
        </div>
        <button
          onClick={() => onCopy(content, id)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            isCopied
              ? "bg-green-50 border-green-200 text-green-600"
              : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="bg-slate-50/50 rounded-2xl p-6 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
          {content}
        </p>
      </div>
    </div>
  );
}

// Additional missing icons for the sub-component
import { Users, MessageSquare } from "lucide-react";
