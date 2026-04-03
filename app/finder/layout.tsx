import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Description Analyzer",
  description:
    "Paste any job description or LinkedIn URL and let PlacementGO's AI extract key skills, required qualifications, and insider tips to tailor your application perfectly.",
  keywords: [
    "job description analyzer",
    "JD analyzer",
    "job skills extractor",
    "AI job analysis",
    "job requirement parser",
    "resume keyword matcher",
  ],
  openGraph: {
    title: "Job Description Analyzer | PlacementGO",
    description:
      "Instantly break down any job description — extract must-have skills, keywords, and tailored advice to help you stand out.",
    url: "https://placementgo.in/finder",
  },
  alternates: {
    canonical: "https://placementgo.in/finder",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://placementgo.in" },
    { "@type": "ListItem", position: 2, name: "JD Analyzer", item: "https://placementgo.in/finder" },
  ],
};

export default function FinderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
