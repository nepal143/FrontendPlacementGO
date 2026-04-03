"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../component/Navbar"; // Adjust import path as needed
import { apiFetch, API_BASE_URL } from "@/lib/api";
import {
  CheckCircle,
  ArrowRight,
  Search,
  Globe,
  Users2,
  MessageCircle,
  Loader2,
  AlertCircle,
  Target,
  BarChart3,
  ListChecks,
  Lightbulb,
  Cpu,
  FileDown,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const downloadReport = () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push(`JD INTEL REPORT`);
    lines.push(`Company: ${result.company}   Role: ${result.role}`);
    lines.push(`Difficulty: ${result.difficultyLevel}   Confidence Score: ${result.confidenceScore}`);
    lines.push(`\nSummary\n${result.sourceSummary}`);

    if (result.focusAreas?.length) {
      lines.push(`\nKey Focus Areas\n${result.focusAreas.join(", ")}`);
    }

    if (result.evaluationCriteria?.length) {
      lines.push(`\nEvaluation Criteria`);
      result.evaluationCriteria.forEach((c: any) => {
        lines.push(`  ${c.name}: ${c.percentage}%`);
      });
    }

    if (result.preparationChecklist?.length) {
      lines.push(`\nPreparation Checklist`);
      [...result.preparationChecklist]
        .sort((a: any, b: any) => a.priority - b.priority)
        .forEach((item: any, i: number) => {
          lines.push(`  ${i + 1}. ${item.title}`);
          lines.push(`     ${item.description}`);
        });
    }

    if (result.systemDesignFocus?.length) {
      lines.push(`\nSystem Design Focus\n${result.systemDesignFocus.join(", ")}`);
    }

    if (result.codingFocus?.length) {
      lines.push(`\nCoding Focus\n${result.codingFocus.join(", ")}`);
    }

    if (result.companyTips?.length) {
      lines.push(`\nInside Tips for ${result.company}`);
      result.companyTips.forEach((tip: string, i: number) => {
        lines.push(`  ${i + 1}. ${tip}`);
      });
    }

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jd-intel-${result.company}-${result.role}.txt`.replace(/\s+/g, "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  };

  const analyzeJD = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiFetch(
        `${API_BASE_URL}/api/jd-intel/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(formData),
        },
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans">
      <Navbar />

      {/* --- HERO / INPUT SECTION --- */}
      <header className="relative pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              AI Powered JD Intel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-6">
            Analyze the Job.{" "}
            <span className="text-blue-600">Crack the Interview.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Paste the job description below. Our AI will break down the exact
            skills, focus areas, and evaluation criteria you need to land the
            offer.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 max-w-4xl mx-auto relative overflow-hidden">
          <form onSubmit={analyzeJD} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Google"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g. Software Engineer"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Paste the full job description here..."
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  <Search size={20} /> Generate Intel Report
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}
        </div>
      </header>

      {/* --- RESULTS SECTION --- */}
      {result && (
        <section className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10 border-b border-slate-200 dark:border-slate-700 pb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
                {result.company} - {result.role}
                <span className="text-sm px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-bold">
                  {result.difficultyLevel} Difficulty
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400">{result.sourceSummary}</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Confidence Score
                </span>
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center relative">
                  <span className="font-bold text-blue-600">
                    {result.confidenceScore}
                  </span>
                </div>
              </div>
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              >
                <FileDown size={16} /> Download Report
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Focus Areas */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                <Target className="text-blue-500" />
                <h3 className="font-bold text-lg">Key Focus Areas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.focusAreas?.map((area: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                <BarChart3 className="text-blue-500" />
                <h3 className="font-bold text-lg">Evaluation Criteria</h3>
              </div>
              <div className="space-y-4">
                {result.evaluationCriteria?.map(
                  (criteria: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {criteria.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {criteria.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${criteria.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Preparation Checklist */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                <ListChecks className="text-blue-500" />
                <h3 className="font-bold text-lg">Preparation Checklist</h3>
              </div>
              <div className="space-y-4">
                {result.preparationChecklist
                  ?.sort((a: any, b: any) => a.priority - b.priority)
                  .map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="mt-1">
                        <CheckCircle className="text-slate-300" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* System Design & Coding Focus */}
            {(result.systemDesignFocus?.length > 0 ||
              result.codingFocus?.length > 0) && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                  <Cpu className="text-blue-500" />
                  <h3 className="font-bold text-lg">Technical Focus</h3>
                </div>

                {result.systemDesignFocus?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      System Design
                    </h4>
                    <ul className="space-y-2">
                      {result.systemDesignFocus.map(
                        (item: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-600 dark:text-slate-300 flex gap-2"
                          >
                            <span className="text-blue-400">•</span> {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Company Tips */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl col-span-1 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-yellow-300" />
                <h3 className="font-bold text-xl">
                  Inside Tips for {result.company}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {result.companyTips?.map((tip: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <ArrowRight
                      className="text-blue-300 shrink-0 mt-1"
                      size={16}
                    />
                    <p className="text-blue-50 font-medium leading-relaxed">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- FOOTER SECTION --- */}
      <footer className="pt-16 sm:pt-20 pb-10 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                PlacementGo
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-8">
              Helping the next generation of talent find their place in the
              world&apos;s most innovative companies.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Globe size={18} />} />
              <SocialIcon icon={<Users2 size={18} />} />
              <SocialIcon icon={<MessageCircle size={18} />} />
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn
              title="Platform"
              links={[
                { label: "Resume Optimizer", href: "/resumeoptimizer" },
                { label: "Referral Network", href: "/finder" },
                { label: "Application Tracker", href: "/tracker" },
                { label: "Interview Prep", href: "/interview" },
              ]}
            />
            <FooterColumn
              title="Resources"
              links={[
                { label: "Career Blog", href: "/dashboard" },
                { label: "Help Center", href: "mailto:support@placementgo.in" },
                { label: "Success Stories", href: "/dashboard" },
                { label: "Guides", href: "/dashboard" },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: "About Us", href: "/" },
                { label: "Contact", href: "mailto:support@placementgo.in" },
                { label: "Privacy Policy", href: "mailto:support@placementgo.in" },
                { label: "Terms", href: "mailto:support@placementgo.in" },
              ]}
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2026 PlacementGo Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 font-medium">
            <Link href="mailto:support@placementgo.in" className="hover:text-blue-600 transition">
              Privacy
            </Link>
            <Link href="mailto:support@placementgo.in" className="hover:text-blue-600 transition">
              Terms
            </Link>
            <Link href="mailto:support@placementgo.in" className="hover:text-blue-600 transition">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-200 shadow-sm">
      {icon}
    </button>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
