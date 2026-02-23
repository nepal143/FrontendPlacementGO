"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/resumeoptimizer", label: "Resume Optimizer" },
    { href: "/referalfinder", label: "Referal Finder" },
    { href: "/interview", label: "Interview Guide" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <span className="text-xl font-bold tracking-tight">PlacementGo</span>
        </Link>
      </div>
      

      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition ${
              pathname === link.href
                ? "text-blue-600 font-semibold"
                : "hover:text-blue-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
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
  );
}