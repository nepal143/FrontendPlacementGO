import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Optimizer",
  description:
    "Upload your resume and a job description. PlacementGO's AI rewrites your resume to beat ATS filters, boost keyword density, and maximize your interview callback rate.",
  keywords: [
    "AI resume optimizer",
    "ATS resume checker",
    "resume keyword optimizer",
    "free resume review",
    "AI resume builder",
    "ATS-friendly resume",
    "resume scoring tool",
  ],
  openGraph: {
    title: "AI Resume Optimizer | PlacementGO",
    description:
      "Beat ATS filters with AI. Upload your resume + job description and get a tailored, keyword-optimized resume in seconds.",
    url: "https://placementgo.in/resumeoptimizer",
  },
  alternates: {
    canonical: "https://placementgo.in/resumeoptimizer",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://placementgo.in" },
    { "@type": "ListItem", position: 2, name: "Resume Optimizer", item: "https://placementgo.in/resumeoptimizer" },
  ],
};

export default function ResumeOptimizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
