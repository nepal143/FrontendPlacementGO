import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://placementgo.in"),
  title: {
    default: "PlacementGO — AI Career Platform for Students",
    template: "%s | PlacementGO",
  },
  description:
    "PlacementGO is the all-in-one AI-powered career platform that helps students optimize resumes, find referrals, track applications, and ace interviews at top tech companies.",
  keywords: [
    "AI resume optimizer",
    "job application tracker",
    "referral finder",
    "AI interview coach",
    "placement platform",
    "career platform for students",
    "ATS resume checker",
    "tech job referrals",
    "placement preparation",
    "job search tool",
  ],
  authors: [{ name: "PlacementGO" }],
  creator: "PlacementGO",
  publisher: "PlacementGO",
  category: "Career & Education",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PlacementGO",
    title: "PlacementGO — AI Career Platform for Students",
    description:
      "Optimize your resume, find referrals, track applications, and ace interviews — all powered by AI. Trusted by 10,000+ students.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlacementGO — AI Career Platform for Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlacementGO — AI Career Platform for Students",
    description:
      "Optimize your resume, find referrals, track applications, and ace interviews — all powered by AI.",
    images: ["/og-image.png"],
    creator: "@placementgo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://placementgo.in",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlacementGO",
  url: "https://placementgo.in",
  logo: "https://placementgo.in/logo.png",
  description:
    "AI-powered career platform helping students land jobs at top tech companies.",
  sameAs: [
    "https://twitter.com/placementgo",
    "https://linkedin.com/company/placementgo",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PlacementGO",
  url: "https://placementgo.in",
  description:
    "All-in-one AI career platform: resume optimizer, referral finder, application tracker, and interview coach.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://placementgo.in/finder?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PlacementGO",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "AI-powered career companion for students: ATS resume optimization, referral outreach, job application tracking, and interview preparation.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "512",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is PlacementGO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PlacementGO is an AI-powered career platform that helps students optimize their resumes for ATS, find employee referrals at top tech companies, track job applications, and prepare for interviews — all in one place. Visit https://placementgo.in to get started for free.",
      },
    },
    {
      "@type": "Question",
      name: "Is PlacementGO free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, PlacementGO is free to use. Sign up and get instant access to the resume optimizer, referral finder, application tracker, and AI interview coach.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI resume optimizer work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your existing resume and paste the job description. PlacementGO's AI rewrites your resume to match keywords, improve structure, and pass ATS filters — increasing your chance of getting shortlisted.",
      },
    },
    {
      "@type": "Question",
      name: "How does the referral finder work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste a job URL or description and PlacementGO generates a personalized cold-outreach email template you can send to alumni or employees at the company to request a referral.",
      },
    },
    {
      "@type": "Question",
      name: "What companies have PlacementGO users been placed in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PlacementGO users have landed roles at Google, Microsoft, Amazon, Meta, Apple, and hundreds of other top tech companies worldwide.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external origins for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
