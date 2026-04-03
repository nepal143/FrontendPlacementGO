import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to PlacementGO to access your AI-powered career dashboard — resume optimizer, referral finder, job tracker, and interview coach.",
  openGraph: {
    title: "Sign In | PlacementGO",
    description: "Access your AI-powered career platform. Optimize resumes, find referrals, and track your job applications.",
    url: "https://placementgo.in/login",
  },
  alternates: {
    canonical: "https://placementgo.in/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
