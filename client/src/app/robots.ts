import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/az", "/ru"],
      disallow: ["/dashboard/"],
    },
    sitemap: "https://jetschool.az/sitemap.xml",
  };
}
