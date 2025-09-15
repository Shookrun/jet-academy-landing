import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // ishi bitirende ashagidakileri ac
      // allow: ["/", "/az", "/ru"],
      // disallow: ["/dashboard/"],
      disallow: ["/*"],
    },
    sitemap: "https://jetschool.az/sitemap.xml",
  };
}
