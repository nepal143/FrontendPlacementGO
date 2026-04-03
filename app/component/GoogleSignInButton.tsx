"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
      console.warn("Google Client ID not configured");
      return;
    }

    const initGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    };

    // Wait for the Google script to load
    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      authLogin(
        data.token,
        data.userId,
        data.email,
        data.name,
        data.profilePicture
      );
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google sign-in error:", error.message);
      alert("Google sign-in failed. Please try again.");
    }
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    return null; // Don't show button if not configured
  }

  return <div ref={buttonRef} className="w-full flex justify-center" />;
}
