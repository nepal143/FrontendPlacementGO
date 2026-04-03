"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link. Please request a new one.");
  }, [token]);

  const handleReset = async () => {
    if (!token) return;
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
      setTimeout(() => router.push("/login"), 3000);
    } catch (e: any) {
      setStatus("error");
      setError(e.message || "Reset failed. The link may have expired — request a new one.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.07)]">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-lg">📄</div>
            PlacementGO
          </div>
        </div>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Password updated!</h2>
            <p className="text-sm text-slate-500">Redirecting you to sign in...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Set new password</h1>
            <p className="text-sm text-slate-500 text-center mb-7">
              Enter a strong new password for your account.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">New password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition disabled:opacity-50"
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm new password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                disabled={!token}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md py-2 px-3 text-center">
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={status === "loading" || !token}
              className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </button>

            <p className="text-center text-xs text-slate-500 mt-5">
              <a href="/login" className="text-blue-500 hover:underline font-medium">
                ← Back to sign in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
