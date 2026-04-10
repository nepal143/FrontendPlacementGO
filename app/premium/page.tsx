"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../component/Navbar";

const jobListings = [
  {
    id: 1,
    title: "Staff Product Designer",
    company: "Linear",
    type: "Remote",
    salary: "$130k - $190k",
    tags: ["Design Systems", "React", "Fintech"],
    match: 98,
    logo: "L",
    logoColor: "#5E6AD2",
    posted: "Posted 2d ago",
  },
  {
    id: 2,
    title: "Principal UX Strategist",
    company: "Airbnb",
    location: "San Francisco, CA",
    salary: "$150k - $210k",
    tags: ["Strategic Research", "Leadership", "Consumer Tech"],
    match: 86,
    logo: "A",
    logoColor: "#FF5A5F",
    posted: "Posted 4d ago",
  },
];

const recentlyApplied = [
  {
    id: 1,
    title: "Senior UI Engineer",
    company: "Vercel • Auto-Applied",
    status: "Success",
    time: "13 min ago",
    color: "#00C781",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Notion • Outreach Sent",
    status: "Pending",
    time: "1 hour ago",
    color: "#F5A623",
  },
];

export default function PlacementGoPage() {
const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [roleCategory, setRoleCategory] = useState("Product Design");
  const [location, setLocation] = useState("Remote, NY, SF...");
  const [salary, setSalary] = useState("$120k - $180k");

useEffect(() => {
  if (!loading && !isLoggedIn) {
    router.push("/login");
  }
}, [isLoggedIn, loading, router]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .mono { font-family: 'DM Mono', monospace; }
        .match-badge { background: linear-gradient(135deg, #00C781 0%, #00A86B 100%); }
        .match-badge-med { background: linear-gradient(135deg, #4A9EFF 0%, #1A7BE8 100%); }
        .auto-apply-btn { background: linear-gradient(135deg, #1A56FF 0%, #0038CC 100%); }
        .card-hover { transition: box-shadow 0.2s, transform 0.2s; }
        .card-hover:hover { box-shadow: 0 8px 32px rgba(26,86,255,0.10); transform: translateY(-1px); }
        .tag { background: #EEF2FF; color: #3B5BDB; border-radius: 99px; padding: 2px 10px; font-size: 12px; font-weight: 500; }
        .pill-success { background: #DCFCE7; color: #16A34A; border-radius: 99px; padding: 1px 10px; font-size: 11px; font-weight: 600; }
        .pill-pending { background: #FEF9C3; color: #CA8A04; border-radius: 99px; padding: 1px 10px; font-size: 11px; font-weight: 600; }
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
        .applying-bar { background: linear-gradient(90deg, #1A56FF 0%, #4A9EFF 66%); }
      `}</style>

      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
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
              <div className="text-xs text-gray-400 font-medium">AUTO-APPLY CREDITS</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-bold text-gray-800 mono">42</span>
                <span className="text-gray-400 text-sm">/ 50 Remaining</span>
              </div>
            </div>
            <button className="bg-[#1A56FF] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0038CC] transition-colors">
              Top Up
            </button>
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
              <option>Product Design</option>
              <option>UX Research</option>
              <option>Engineering</option>
              <option>Product Management</option>
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
          <button className="auto-apply-btn text-white text-sm font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
            ⚡ Apply Filters
          </button>
        </div>

        {/* Applying Banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
            <span className="text-[#1A56FF] text-base">⚡</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-semibold text-gray-800 text-sm">Applying to Senior Product Designer</span>
              <span className="text-gray-400 text-xs">Stripe • San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="applying-bar h-1.5 rounded-full" style={{ width: "66%" }}></div>
              </div>
              <span className="text-[#1A56FF] text-xs font-semibold whitespace-nowrap">66% Complete</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* Left: Job Listings */}
          <div className="flex flex-col gap-4">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ backgroundColor: job.logoColor }}
                  >
                    {job.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900 text-base">{job.title}</h3>
                      <span
                        className={`text-white text-xs font-bold px-2.5 py-0.5 rounded-full ${job.match >= 90 ? "match-badge" : "match-badge-med"}`}
                      >
                        +{job.match}% Match
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-gray-500 text-xs">
                      <span>{job.company}</span>
                      {job.location && <><span>•</span><span>{job.location}</span></>}
                      {job.type && <><span>•</span><span>{job.type}</span></>}
                      <span>•</span><span className="mono">{job.salary}</span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs shrink-0 hidden sm:block">{job.posted}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="auto-apply-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex-1 sm:flex-none">
                    ⚡ Auto-Apply
                  </button>
                  <button className="border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex-1 sm:flex-none">
                    📄 Outreach Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="sidebar-col flex flex-col gap-4">

            {/* Recently Applied */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-900 text-sm">Recently Applied</span>
                <button className="text-[#1A56FF] text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {recentlyApplied.map((item) => (
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
                      <span className={item.status === "Success" ? "pill-success" : "pill-pending"}>
                        {item.status}
                      </span>
                      <span className="text-gray-400 text-[10px]">{item.time}</span>
                    </div>
                  </div>
                ))}
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
                <span className="text-[#1A56FF] font-semibold">Product Design</span> roles. We recommend adding{" "}
                <span className="font-semibold">"Systems Thinking"</span> to reach 100%.
              </div>
            </div>

            {/* Plan Card */}
            <div className="plan-card rounded-2xl p-5">
              <div className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest mb-1">Current Plan</div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg">Premium Pro</span>
                <button className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  Sides
                </button>
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
