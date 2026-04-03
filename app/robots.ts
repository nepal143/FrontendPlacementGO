import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/resumeoptimizer", "/studio", "/finder", "/referalfinder", "/tracker", "/interview"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://placementgo.in/sitemap.xml",
    host: "https://placementgo.in",
  };
}
