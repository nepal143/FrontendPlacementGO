"use client";

import React from "react";
import {
  LayoutDashboard,
  FileText,
  UserPlus,
  Briefcase,
  GraduationCap,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  Plus,
  Upload,
  Calendar,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">PlacementGo</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Menu
          </p>
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <SidebarItem icon={<FileText size={20} />} label="Resume Studio" />
          <SidebarItem icon={<UserPlus size={20} />} label="Referral Finder" />
          <SidebarItem icon={<Briefcase size={20} />} label="Applications" />
          <SidebarItem
            icon={<GraduationCap size={20} />}
            label="Interview Guide"
          />

          <div className="pt-8">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Account
            </p>
            <SidebarItem icon={<Settings size={20} />} label="Settings" />
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-3">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              className="w-10 h-10 rounded-full bg-slate-100"
              alt="Alex"
            />
            <div>
              <p className="text-sm font-bold">Alex Johnson</p>
              <p className="text-[11px] text-slate-500 font-medium">
                Student Plan
              </p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header / Search Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search applications, companies..."
              className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="p-2 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black mb-1">Good morning, Alex</h1>
            <p className="text-slate-500 text-sm">
              Here&apos;s a summary of your career progress today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Total Applications"
              value="42"
              change="+12%"
              positive
              icon={<Briefcase className="text-blue-600" />}
              subtext="vs. last 30 days"
            />
            <StatCard
              title="Interviewing"
              value="8"
              change="+25%"
              positive
              icon={<Calendar className="text-blue-600" />}
              subtext="Currently active pipelines"
            />
            <StatCard
              title="Offers Received"
              value="2"
              change="0%"
              icon={<GraduationCap className="text-blue-600" />}
              subtext="2 new offers pending review"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Actions & Pipeline */}
            <div className="lg:col-span-8 space-y-8">
              {/* Quick Actions */}
              <div>
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ActionButton icon={<Upload size={20} />} label="Upload CV" />
                  <ActionButton icon={<Plus size={20} />} label="Log App" />
                  <ActionButton
                    icon={<Search size={20} />}
                    label="Find Referrals"
                  />
                  <ActionButton
                    icon={<Calendar size={20} />}
                    label="Schedule"
                  />
                </div>
              </div>

              {/* Active Pipeline Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold">Active Pipeline</h3>
                  <button className="text-blue-600 text-xs font-bold hover:underline">
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Position</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <TableRow
                        logo="G"
                        company="Google"
                        position="Software Engineer Intern"
                        status="Interviewing"
                        time="2h ago"
                        statusColor="bg-orange-50 text-orange-600"
                      />
                      <TableRow
                        logo="S"
                        company="Stripe"
                        position="Product Management Intern"
                        status="Applied"
                        time="1d ago"
                        statusColor="bg-blue-50 text-blue-600"
                      />
                      <TableRow
                        logo="A"
                        company="Airbnb"
                        position="Frontend Developer"
                        status="Offer"
                        time="3d ago"
                        statusColor="bg-green-50 text-green-600"
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Activity & Goals */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  <ActivityItem
                    icon={<FileText size={16} />}
                    color="bg-blue-50 text-blue-600"
                    text="You updated your Software Engineer resume."
                    time="Today at 10:42 AM"
                  />
                  <ActivityItem
                    icon={<CheckCircle size={16} />}
                    color="bg-green-50 text-green-600"
                    text="Application to Microsoft was successful."
                    time="Yesterday at 4:15 PM"
                  />
                  <ActivityItem
                    icon={<UserPlus size={16} />}
                    color="bg-purple-50 text-purple-600"
                    text="Referral request sent to Sarah Miller at Google."
                    time="Oct 24, 2023"
                  />
                </div>
                <button className="w-full mt-8 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                  Load More
                </button>
              </div>

              {/* Learning Card */}
              <div className="bg-[#2563EB] rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <TrendingUp size={100} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Monthly Goal</h4>
                  <p className="text-blue-100 text-xs mb-6 leading-relaxed">
                    Complete 10 interview prep modules to earn your
                    certification.
                  </p>

                  <div className="mb-8">
                    <div className="flex justify-between text-[11px] font-bold mb-2">
                      <span>Progress</span>
                      <span>70%</span>
                    </div>
                    <div className="h-2 w-full bg-blue-700/50 rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                  </div>

                  <button className="w-full bg-white text-[#2563EB] py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors">
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
        active
          ? "bg-blue-50 text-blue-600 shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, change, positive, icon, subtext }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${positive ? "text-green-600 bg-green-50" : "text-slate-400 bg-slate-50"}`}
        >
          {positive ? <TrendingUp size={12} /> : null} {change}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-black mb-1">{value}</h2>
        <p className="text-[10px] text-slate-400 font-medium">{subtext}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl gap-3 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-50 transition-all group">
      <div className="text-blue-600 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </button>
  );
}

function TableRow({ logo, company, position, status, time, statusColor }: any) {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-blue-600 text-xs">
            {logo}
          </div>
          <span className="font-bold">{company}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-slate-500 font-medium">{position}</td>
      <td className="px-6 py-5">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor}`}
        >
          {status}
        </span>
      </td>
      <td className="px-6 py-5 text-slate-400 text-xs font-medium">{time}</td>
    </tr>
  );
}

function ActivityItem({ icon, color, text, time }: any) {
  return (
    <div className="flex gap-4">
      <div
        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700 leading-relaxed mb-1">
          {text}
        </p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          {time}
        </p>
      </div>
    </div>
  );
}
