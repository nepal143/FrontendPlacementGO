import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account",
  description:
    "Sign up for PlacementGO for free. Get AI resume optimization, referral outreach templates, job application tracking, and interview coaching — all in one platform.",
  openGraph: {
    title: "Create Free Account | PlacementGO",
    description:
      "Join 10,000+ students using PlacementGO to land jobs at Google, Microsoft, Amazon, and more. Free forever.",
    url: "https://placementgo.in/register",
  },
  alternates: {
    canonical: "https://placementgo.in/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
