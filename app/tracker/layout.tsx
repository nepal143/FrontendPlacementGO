import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description:
    "Track every job application in one place. Log companies, roles, interview stages, and deadlines. Never lose track of an opportunity with PlacementGO's smart tracker.",
  keywords: [
    "job application tracker",
    "job search organizer",
    "application status tracker",
    "interview pipeline",
    "job hunt spreadsheet alternative",
    "job offer tracker",
  ],
  openGraph: {
    title: "Job Application Tracker | PlacementGO",
    description:
      "Ditch the spreadsheet. Track all your applications, interviews, and offers in a clean, organized dashboard.",
    url: "https://placementgo.in/tracker",
  },
  alternates: {
    canonical: "https://placementgo.in/tracker",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://placementgo.in" },
    { "@type": "ListItem", position: 2, name: "Application Tracker", item: "https://placementgo.in/tracker" },
  ],
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
