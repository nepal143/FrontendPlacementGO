"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async () => {
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/upload");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const strength =
    password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-green-500"];
  const strengthTextColor = ["", "text-red-500", "text-amber-500", "text-green-500"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">

      {/* NAV */}
      <nav className="bg-[#1a1a2e] flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-2.5 text-white font-bold text-sm">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-base">
            📄
          </div>
          Resume Studio
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
        <div className="bg-white border border-gray-200 rounded-2xl p-11 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.07)]">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-lg">
                📄
              </div>
              Resume Studio
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Start optimizing your resume with AI — it's free
          </p>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition
                ${fullName.trim().length > 1 ? "border-green-500" : "border-gray-200"}`}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition
                ${email.includes("@") && email.includes(".") ? "border-green-500" : "border-gray-200"}`}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition"
            />

            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded transition-all
                      ${strength >= i ? strengthColor[strength] : "bg-gray-200"}`}
                  />
                ))}
                <span className={`text-xs font-semibold ml-2 ${strengthTextColor[strength]}`}>
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && register()}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition
                ${
                  confirmPassword.length > 0
                    ? confirmPassword === password
                      ? "border-green-500"
                      : "border-red-500"
                    : "border-gray-200"
                }`}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mb-5 text-xs text-slate-500 leading-relaxed">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <label>
              I agree to the{" "}
              <span className="text-blue-500 font-medium hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-blue-500 font-medium hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </label>
          </div>

          {/* Button */}
          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Creating account...
              </>
            ) : (
              <>✨ Create Free Account</>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mt-3 text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-md py-2 px-3">
              ⚠ {error}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-xs text-slate-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span>already have an account?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login */}
          <div className="text-center text-xs text-slate-500">
            <a
              href="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign in instead
            </a>
          </div>

          {/* Badges */}
          <div className="flex justify-center gap-4 mt-6">
            {["AI-Powered", "ATS Optimized", "Free to Start"].map((badge) => (
              <span key={badge} className="flex items-center gap-1 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}