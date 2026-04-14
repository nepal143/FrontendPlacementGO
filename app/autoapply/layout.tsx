import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Automation | PlacementGO",
  description: "AI-powered automated job discovery, matching, and application",
};

export default function AutoApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
