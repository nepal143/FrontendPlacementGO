"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  Layout,
  History,
  Lightbulb,
  ChevronRight,
  ArrowRightLeft,
} from "lucide-react";

export default function ResumeStudio() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Resume Studio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavTab label="Dashboard" />
            <NavTab label="Optimizer" active />
            <NavTab label="Templates" />
            <NavTab label="Career Insights" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors">
            Upgrade Pro
          </button>
          <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Profile"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* --- HEADER --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Resume Optimizer</h1>
          <p className="text-slate-500 font-medium">
            Tailor your profile to specific job descriptions and beat the ATS
            filters instantly.
          </p>
        </div>

        {/* --- INPUT SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* 1. Upload Resume */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm group hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold">Upload Your Resume</h3>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 bg-slate-50/30"
              }`}
            >
              <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Upload size={24} />
              </div>
              <p className="font-bold text-sm mb-1">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-slate-400 mb-6">
                PDF, DOCX up to 10MB
              </p>
              <button className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
                Select File
              </button>
            </div>
          </div>

          {/* 2. Paste Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold">Paste Job Description</h3>
            </div>
            <textarea
              placeholder="Paste the full job requirements here to identify missing keywords and skills..."
              className="flex-1 w-full p-6 bg-slate-50/30 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[200px]"
            />
          </div>
        </div>

        {/* --- ACTION BUTTON --- */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 flex items-center gap-3 transition-transform active:scale-95">
            <Sparkles size={20} />
            Generate Optimized Resume
          </button>
          <div className="flex gap-6 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" /> AI-Powered
              Analysis
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" /> ATS Score
              Optimization
            </span>
          </div>
        </div>

        {/* --- PREVIEW SECTION --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Preview Toolbar */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="font-black text-xl tracking-tight">
                Optimization Preview
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  ATS Score
                </span>
                <span className="text-lg font-black">94%</span>
              </div>
              <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors">
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>

          {/* Side-by-Side View */}
          <div className="grid lg:grid-cols-2 divide-x divide-slate-100 min-h-[800px]">
            {/* Original Version */}
            <div className="p-12 relative">
              <div className="absolute top-6 left-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Original Version
              </div>
              <div className="mt-8 opacity-40 select-none grayscale">
                <ResumeContent name="ALEX JOHNSON" isOriginal />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]" />
            </div>

            {/* Optimized Version */}
            <div className="p-12 bg-slate-50/20 relative">
              <div className="absolute top-6 left-12 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                Optimized Version (ATS-READY)
              </div>

              <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-xl border border-slate-100 p-12 min-h-full">
                <ResumeContent name="ALEX JOHNSON" />

                {/* Optimized Badge */}
                <div className="absolute bottom-6 right-6">
                  <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <Sparkles size={12} /> OPTIMIZED BY AI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Utility Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 backdrop-blur-xl border border-slate-700/50 p-2 rounded-2xl flex items-center gap-2 shadow-2xl z-50">
            <UtilityButton
              label="ATS Keywords Found (12)"
              color="bg-green-500"
            />
            <div className="w-px h-6 bg-slate-700 mx-1" />
            <UtilityButton
              label="Format: Standard Harvard"
              color="bg-blue-500"
            />
            <button className="text-white text-xs font-bold px-4 py-2 hover:bg-slate-800 rounded-xl transition-colors">
              Edit Formatting
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavTab({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`text-sm font-bold transition-all relative py-2 ${
        active ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
      )}
    </button>
  );
}

function UtilityButton({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl text-[11px] font-bold text-white border border-slate-700/50">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function ResumeContent({
  name,
  isOriginal = false,
}: {
  name: string;
  isOriginal?: boolean;
}) {
  return (
    <div className="font-serif text-[13px] leading-relaxed text-[#1e293b]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold tracking-[0.1em] text-slate-900 mb-2">
          {name}
        </h2>
        <p className="text-slate-500 text-xs">
          New York, NY | alex.j@email.com |{" "}
          <span className="text-blue-600">linkedin.com/in/alexj</span>
        </p>
      </div>

      <Section title="PROFESSIONAL SUMMARY">
        <p>
          Dynamic <Highlight text="Full-Stack Software Engineer" /> with 3+
          years of experience specializing in
          <Highlight text="React.js" /> and{" "}
          <Highlight text="Agile Methodologies" />. Proven track record...
        </p>
      </Section>

      <Section title="PROFESSIONAL EXPERIENCE">
        <div className="flex justify-between font-bold text-slate-900 mb-1">
          <span>Software Engineer II</span>
          <span>Oct 2021 - Present</span>
        </div>
        <div className="italic text-slate-500 text-xs mb-3">
          TechCorp Solutions | New York, NY
        </div>
        <ul className="list-disc pl-4 space-y-2">
          <li>
            Engineered responsive frontend architectures using{" "}
            <Highlight text="React Hooks" /> and{" "}
            <Highlight text="Tailwind CSS" />.
          </li>
          <li>
            Implemented <Highlight text="RESTful API" /> integrations and
            managed state using Redux Toolkit.
          </li>
          <li>
            Optimized <Highlight text="CI/CD pipelines" /> reducing deployment
            time by 15 minutes per cycle.
          </li>
          <li>
            Collaborated in <Highlight text="Cross-functional Teams" /> to
            deliver high-quality code.
          </li>
        </ul>
      </Section>

      <Section title="TECHNICAL SKILLS">
        <p>
          <span className="font-bold">Languages:</span> JavaScript (ES6+),
          TypeScript, HTML5, CSS3, SQL
        </p>
        <p>
          <span className="font-bold">Frameworks:</span> React, Next.js,
          Node.js, Express
        </p>
        <p>
          <span className="font-bold">Tools:</span> Git, Docker, AWS, Jenkins,
          Jira
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h4 className="text-[11px] font-black text-slate-900 border-b-2 border-slate-900 mb-4 pb-1 tracking-widest">
        {title}
      </h4>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

function Highlight({ text }: { text: string }) {
  return (
    <span className="bg-green-100 text-green-800 px-1 rounded font-medium border border-green-200/50">
      {text}
    </span>
  );
}
