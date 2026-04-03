import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Coach",
  description:
    "Prepare for any interview with PlacementGO's AI coach. Get company-specific questions, model answers, behavioral tips, and real-time feedback tailored to your target role.",
  keywords: [
    "AI interview coach",
    "interview preparation",
    "mock interview",
    "behavioral interview questions",
    "technical interview prep",
    "STAR method interview",
    "interview questions and answers",
  ],
  openGraph: {
    title: "AI Interview Coach | PlacementGO",
    description:
      "Company-specific interview questions, model answers, and AI feedback — walk into every interview fully prepared.",
    url: "https://placementgo.in/interview",
  },
  alternates: {
    canonical: "https://placementgo.in/interview",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://placementgo.in" },
    { "@type": "ListItem", position: 2, name: "Interview Coach", item: "https://placementgo.in/interview" },
  ],
};

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
