"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import GoogleSignInButton from "../component/GoogleSignInButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpSent, setFpSent] = useState(false);
  const [fpError, setFpError] = useState("");

  const handleForgotPassword = async () => {
    if (!fpEmail.trim()) { setFpError("Please enter your email address."); return; }
    setFpLoading(true);
    setFpError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim() }),
      });
      // Show success regardless (prevents email enumeration)
      setFpSent(true);
    } catch {
      setFpSent(true); // show success even on network error to prevent enumeration
    } finally {
      setFpLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      authLogin(data.token, data.userId, email);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-900 font-sans">
      
      {/* NAV */}
      <nav className="bg-[#1a1a2e] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-base">
            📄
          </div>
          PlacementGo
        </div>

        <div className="flex gap-1">
          {["Dashboard", "Optimizer", "Templates", "Career Insights"].map((item) => (
            <button
              key={item}
              className="text-slate-400 hover:text-white px-3.5 py-1.5 rounded-md text-sm transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="w-[120px]" />
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 sm:p-11 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.07)]">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-lg">
                📄
              </div>
              Resume Studio
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
            Sign in to your account to continue
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Forgot */}
          <div className="flex justify-end -mt-2 mb-4">
            <button
              type="button"
              onClick={() => { setShowForgotModal(true); setFpEmail(""); setFpSent(false); setFpError(""); }}
              className="text-xs text-blue-500 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
            >
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md py-2 px-3">
              ⚠ {error}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-xs text-slate-400 dark:text-slate-500">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            <span>or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />

          {/* Signup */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Create one free
            </a>
          </div>

          {/* Badges */}
          <div className="flex justify-center gap-4 mt-6">
            {["AI-Powered", "ATS Optimized", "Secure"].map((badge) => (
              <span key={badge} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowForgotModal(false); }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            {fpSent ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">✉️</div>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">Check your inbox</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                  If an account exists for <strong>{fpEmail}</strong>, you will receive a password reset email shortly.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Reset your password</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Enter your email and we'll send you a reset link.</p>
                {fpError && (
                  <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{fpError}</div>
                )}
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                  className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-600 focus:border-blue-500 outline-none transition mb-5"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForgotPassword}
                    disabled={fpLoading}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 transition"
                  >
                    {fpLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}