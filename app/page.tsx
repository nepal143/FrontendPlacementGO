"use client";

import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Play,
  Search,
  Users,
  Layout,
  Globe,
  Users2,
  MessageCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">PlacementGo</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-blue-600 transition">
            How it Works
          </Link>
          <Link href="#pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-16 pb-24 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              New: AI Interview Coach
            </span>
          </div>
          <h1 className="text-6xl font-extrabold leading-[1.1] mb-6">
            Optimize Your Resume. <br />
            <span className="text-blue-600">Get Referrals.</span> <br />
            Track Everything.
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
            The all-in-one career platform designed to help students land their
            dream job at top tech companies. From ATS-proof resumes to direct
            referrals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
            >
              Start Your Journey Free <ArrowRight size={20} />
            </Link>
            <button className="flex items-center gap-2 border border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition">
              <Play size={18} fill="currentColor" /> Watch Demo
            </button>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                >
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Joined by 10,000+ students globally
            </p>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur-2xl opacity-50" />
          <div className="relative bg-slate-100 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden aspect-[4/3]">
            <div className="p-4 border-b border-slate-200 bg-white flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-8">
              <div className="h-4 w-1/3 bg-slate-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-12 w-full bg-white rounded-lg shadow-sm border border-slate-200" />
                <div className="h-12 w-full bg-white rounded-lg shadow-sm border border-slate-200" />
                <div className="h-12 w-full bg-white rounded-lg shadow-sm border border-slate-200" />
              </div>
            </div>
            {/* Notification Toast */}
            <div className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-xl border border-blue-50 flex items-center gap-3">
              <CheckCircle className="text-green-500" />
              <div className="text-xs">
                <p className="font-bold">RECENT SUCCESS</p>
                <p className="text-slate-500">Alex landed a role at Google!</p>
              </div>
              <span className="ml-auto text-[10px] text-slate-400">
                Just now
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- LOGO CLOUD --- */}
      <section className="py-20 border-y border-slate-100">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">
          Our alumni work at world-class companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 px-8 opacity-40 grayscale">
          {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map((company) => (
            <span key={company} className="text-2xl font-bold">
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section
        id="features"
        className="py-24 px-8 max-w-7xl mx-auto text-center"
      >
        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
          Powerful Features
        </span>
        <h2 className="text-4xl font-extrabold mt-4 mb-6">
          Built for modern job searching
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto mb-16">
          Ditch the spreadsheets. PlacementGo gives you the professional tools
          needed to stand out in a competitive market.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            icon={<Search className="text-blue-600" />}
            title="Resume Optimizer"
            features={[
              "Keyword matching",
              "Structural analysis",
              "Action verb generator",
            ]}
          />
          <FeatureCard
            icon={<Users className="text-blue-600" />}
            title="Referral Finder"
            features={[
              "Alumni matching",
              "Cold email templates",
              "Networking roadmap",
            ]}
          />
          <FeatureCard
            icon={<Layout className="text-blue-600" />}
            title="Application Tracker"
            features={[
              "Auto-fill from URLs",
              "Interview reminders",
              "Salary comparison",
            ]}
          />
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="text-left">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                The Process
              </span>
              <h2 className="text-4xl font-extrabold mt-4">
                Three steps to your dream job
              </h2>
            </div>
            <p className="text-slate-400 text-sm mb-2">
              Ready in less than 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Dashed Line Background */}
            <div className="absolute top-12 left-0 w-full h-px border-t-2 border-dashed border-slate-200 hidden md:block" />

            <ProcessStep
              step="01"
              title="Complete Profile"
              desc="Upload your resume and tell us your dream companies and target roles."
            />
            <ProcessStep
              step="02"
              title="Optimize & Connect"
              desc="Use AI to fix your resume and start reaching out to alumni for referrals."
            />
            <ProcessStep
              step="03"
              title="Land the Job"
              desc="Manage interviews in your dashboard and accept the best offer you get."
            />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL SECTION --- */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center gap-10">
          <img
            src="https://i.pravatar.cc/150?u=sarah"
            className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-400"
            alt="Sarah"
          />
          <div className="relative">
            <span className="text-6xl font-serif absolute -top-8 -left-6 opacity-20">
              “
            </span>
            <p className="text-2xl md:text-3xl font-medium leading-snug mb-6">
              PlacementGo changed everything for me. I went from zero interview
              calls to 5 offers in two months. The referral network is a game
              changer.
            </p>
            <div>
              <p className="font-bold text-lg">Sarah Jenkins</p>
              <p className="text-blue-200 text-sm">
                Software Engineer @ Microsoft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0F172A] rounded-[2.5rem] py-16 px-8 text-center relative overflow-hidden">
            {/* Subtle background glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-[#334a80] blur-[100px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Ready to level up your career?
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who have landed jobs at tech giants
                using PlacementGo. No credit card required to start.
              </p>

              <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                Start Free Today
              </button>

              <p className="mt-6 text-sm text-slate-500 font-medium">
                Free forever plan available • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="pt-20 pb-10 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Info */}
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

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterColumn
              title="Platform"
              links={[
                "Resume Optimizer",
                "Referral Network",
                "Application Tracker",
                "Interview Prep",
              ]}
            />
            <FooterColumn
              title="Resources"
              links={[
                "Career Blog",
                "Help Center",
                "Success Stories",
                "Guides",
              ]}
            />
            <FooterColumn
              title="Company"
              links={["About Us", "Contact", "Privacy Policy", "Terms"]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 PlacementGo Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-400 font-medium">
            <Link href="#" className="hover:text-blue-600 transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-blue-600 transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-blue-600 transition">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  features: string[];
}) {
  return (
    <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition group">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li
            key={f}
            className="text-slate-500 text-sm flex items-center gap-2"
          >
            <span className="text-blue-400">✔</span> {f}
          </li>
        ))}
      </ul>
      <Link
        href="#"
        className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
      >
        Learn more <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function ProcessStep({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative text-center flex flex-col items-center group">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mb-6 z-10 border-4 border-white shadow-sm">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
        {desc}
      </p>
    </div>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-100">
      {icon}
    </button>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
