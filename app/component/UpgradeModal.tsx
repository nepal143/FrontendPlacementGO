"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch, API_BASE_URL } from "@/lib/api";

interface SubscriptionStatus {
  isPremium: boolean;
  plan: string | null;
  status: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
}

interface CreateOrderResponse {
  orderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  planName: string;
  description: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const order: CreateOrderResponse = await apiFetch(
        `${API_BASE_URL}/api/v1/payments/create-order`,
        { method: "POST" }
      );

      if (typeof window.Razorpay === "undefined") {
        setError("Payment gateway not loaded. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "PlacementGO",
        description: order.description,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await apiFetch(`${API_BASE_URL}/api/v1/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            onSuccess();
            onClose();
          } catch {
            setError("Payment captured but verification failed. Contact support.");
          }
        },
        theme: { color: "#1A56FF" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch {
      setError("Failed to create payment order. Please try again.");
      setLoading(false);
    }
  }, [onClose, onSuccess]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-[#0A1628] to-[#1A2A4A] p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1 mb-4">
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">PRO Plan</span>
          </div>
          <div className="text-5xl font-bold text-white mb-1">
            ₹499
            <span className="text-xl font-normal text-gray-400">/mo</span>
          </div>
          <p className="text-gray-400 text-sm">Billed monthly · Cancel anytime</p>
        </div>

        {/* Body */}
        <div className="bg-white p-6">
          <ul className="space-y-3 mb-6">
            {[
              ["⚡", "Unlimited AI Auto-Apply to premium jobs"],
              ["🔍", "Access to curated high-match job listings"],
              ["📊", "Priority ATS resume scoring & optimization"],
              ["🤖", "Advanced interview prep with AI feedback"],
              ["🔔", "Real-time job alerts for your target roles"],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-base mt-0.5">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1A56FF] to-[#0038CC] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 text-base"
          >
            {loading ? "Opening Payment..." : "✨ Upgrade to PRO — ₹499/mo"}
          </button>

          <p className="text-center text-gray-400 text-xs mt-3">
            Secure payment via Razorpay · 256-bit SSL encrypted
          </p>

          <button
            onClick={onClose}
            className="w-full mt-2 text-gray-400 text-sm hover:text-gray-600 transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook to fetch and cache subscription status */
export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    plan: null,
    status: null,
    activatedAt: null,
    expiresAt: null,
  });
  const [statusLoading, setStatusLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data: SubscriptionStatus = await apiFetch(`${API_BASE_URL}/api/v1/payments/status`);
      setStatus(data);
    } catch {
      // Silently fail — user just won't see PRO badge
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, statusLoading, refresh };
}
