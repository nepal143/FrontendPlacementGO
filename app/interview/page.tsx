"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Download,
  Save,
  RefreshCw,
  Target,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Zap,
  Plus,
  HelpCircle,
} from "lucide-react";
import Navbar from "../component/Navbar";

export default function InterviewStrategyGuide() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      label: "Update Resume & LinkedIn",
      sub: "Align with job description keywords",
      done: true,
    },
    {
      id: 2,
      label: "Practice LeetCode (Med/Hard)",
      sub: "Focus on Graph and Dynamic Programming",
      done: true,
    },
    {
      id: 3,
      label: "Review Data Structures",
      sub: "Time and Space Complexity mastery",
      done: true,
    },
    {
      id: 4,
      label: "System Design Fundamentals",
      sub: "Scalability, Load Balancing, Database",
      done: false,
    },
    {
      id: 5,
      label: "Mock Interview Session",
      sub: "Conduct at least one peer session",
      done: false,
    },
    {
      id: 6,
      label: "Prepare Behavioral Stories",
      sub: "Find 5 key stories for STAR method",
      done: false,
    },
    {
      id: 7,
      label: "Company Culture Research",
      sub: "Read Google's Three Pillars",
      done: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-100">
      {/* --- HEADER NAVIGATION --- */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-8">
        {/* --- PAGE TITLE & TOP ACTIONS --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black mb-2">
              Interview Strategy Guide
            </h1>
            <p className="text-slate-500 font-medium">
              Comprehensive preparation roadmap for your upcoming interview.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
              <Download size={18} /> Download PDF
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
              <Save size={18} /> Save Strategy
            </button>
          </div>
        </div>

        {/* --- CONTEXT INPUTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Company Name
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Building2 className="text-slate-400" size={20} />
              <input
                type="text"
                defaultValue="Google"
                className="bg-transparent font-bold outline-none flex-1"
              />
            </div>
          </div>
          <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Job Role
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Briefcase className="text-slate-400" size={20} />
              <input
                type="text"
                defaultValue="Software Engineer"
                className="bg-transparent font-bold outline-none flex-1"
              />
            </div>
          </div>
          <button className="md:col-span-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center gap-3 text-blue-600 font-bold hover:bg-blue-100 transition-all">
            <RefreshCw size={20} /> Update Guide Content
          </button>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Columns (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Round Structure */}
              <GuideCard
                icon={<BookOpen className="text-orange-500" />}
                title="Round Structure"
              >
                <div className="space-y-6">
                  <Step
                    num="1"
                    title="Online Assessment"
                    sub="90 mins, Data Structures & Algorithms"
                  />
                  <Step
                    num="2"
                    title="Technical Screening"
                    sub="45 mins, 1:1 Video Coding"
                  />
                  <Step
                    num="3"
                    title="Onsite Loop (4 Rounds)"
                    sub="Coding, System Design, Leadership"
                  />
                </div>
              </GuideCard>

              {/* Focus Areas */}
              <GuideCard
                icon={<Target className="text-blue-500" />}
                title="Focus Areas"
              >
                <div className="flex flex-wrap gap-2 mb-8">
                  {[
                    "Dynamic Programming",
                    "Graphs & Trees",
                    "Big O Analysis",
                    "Object Oriented Design",
                    "System Scalability",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Primary Languages
                  </label>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    Java, C++, Python, or Go (Candidate&apos;s Choice)
                  </p>
                </div>
              </GuideCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Question Patterns */}
              <GuideCard
                icon={<HelpCircle className="text-purple-500" />}
                title="Question Patterns"
              >
                <div className="space-y-4">
                  <div className="bg-purple-50/50 border-l-4 border-purple-500 p-4 rounded-r-xl">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      Algorithmic: Focus on optimizing time complexity. Expect
                      follow-up constraints.
                    </p>
                  </div>
                  <div className="bg-purple-50/50 border-l-4 border-purple-500 p-4 rounded-r-xl">
                    <p className="text-xs font-bold text-slate-800 leading-relaxed">
                      Behavioral: Googleyness & Leadership. Focus on impact and
                      collaboration.
                    </p>
                  </div>
                </div>
              </GuideCard>

              {/* Evaluation Criteria */}
              <GuideCard
                icon={<RefreshCw className="text-green-500" />}
                title="Evaluation Criteria"
              >
                <div className="space-y-5">
                  <StatBar label="Cognitive Ability" value={40} />
                  <StatBar label="Role-Related Knowledge" value={30} />
                  <StatBar label="Leadership" value={20} />
                  <StatBar label="Googleyness" value={10} />
                </div>
              </GuideCard>
            </div>
          </div>

          {/* Right Column (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Checklist */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold">Preparation Checklist</h3>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black">
                  {completedCount} / {tasks.length} Done
                </span>
              </div>
              <div className="space-y-6 mb-8">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex gap-4 group cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all ${
                        task.done
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-200 group-hover:border-blue-400"
                      }`}
                    >
                      {task.done && <CheckCircle2 size={14} />}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${task.done ? "text-slate-400 line-through" : "text-slate-800"}`}
                      >
                        {task.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {task.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-50 border border-blue-100 py-3 rounded-xl text-blue-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all">
                <Plus size={16} /> Add Custom Task
              </button>
            </div>

            {/* Community Feed Card */}
            <div className="bg-[#0B0E14] rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MessageSquare size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Join Interview Prep Chat</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-8">
                  Discuss current interview trends with other applicants at
                  Google.
                </p>
                <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-colors">
                  Open Community Feed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM TIPS --- */}
        <div className="mt-12 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-10 grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
              <Zap size={24} />
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-blue-700 uppercase tracking-widest text-xs">
                Pro Preparation Tips
              </h4>
              <ul className="space-y-4">
                <li className="text-sm font-medium text-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                  Practice explaining your thought process out loud while
                  coding.
                </li>
                <li className="text-sm font-medium text-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                  Review common edge cases for all data structure problems.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="space-y-4 pt-8">
              <ul className="space-y-4">
                <li className="text-sm font-medium text-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                  Use the STAR method for all behavioral responses.
                </li>
                <li className="text-sm font-medium text-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                  Prepare 3-5 thoughtful questions for your interviewer.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPERS ---

function GuideCard({ icon, title, children }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Step({ num, title, sub }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-xs shrink-0">
        {num}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800 mb-1">{title}</p>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          {sub}
        </p>
      </div>
    </div>
  );
}

function StatBar({ label, value }: any) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2">
        <span className="text-slate-500">{label}</span>
        <span className="text-blue-600">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
