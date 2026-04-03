import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Studio",
  description:
    "Fine-tune your AI-generated resume in PlacementGO's Resume Studio. Choose from professional templates, edit content, and download a PDF ready for any application.",
  keywords: [
    "resume studio",
    "resume builder",
    "resume templates",
    "professional resume",
    "resume PDF download",
    "LaTeX resume",
  ],
  openGraph: {
    title: "Resume Studio | PlacementGO",
    description:
      "Pick a template, tweak your AI-optimized resume, and download a recruiter-ready PDF in minutes.",
    url: "https://placementgo.in/studio",
  },
  alternates: {
    canonical: "https://placementgo.in/studio",
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
