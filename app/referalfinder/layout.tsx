import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Finder & Outreach Templates",
  description:
    "Find alumni at your target companies and generate personalized referral request emails with one click. PlacementGO's AI writes cold outreach that gets replies.",
  keywords: [
    "job referral finder",
    "employee referral",
    "cold email template for jobs",
    "LinkedIn outreach",
    "alumni referral",
    "networking for jobs",
    "referral request email",
  ],
  openGraph: {
    title: "Referral Finder & Outreach Templates | PlacementGO",
    description:
      "Find the right person and send the right message. AI-generated referral emails that actually get replies.",
    url: "https://placementgo.in/referalfinder",
  },
  alternates: {
    canonical: "https://placementgo.in/referalfinder",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://placementgo.in" },
    { "@type": "ListItem", position: 2, name: "Referral Finder", item: "https://placementgo.in/referalfinder" },
  ],
};

export default function ReferalFinderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
