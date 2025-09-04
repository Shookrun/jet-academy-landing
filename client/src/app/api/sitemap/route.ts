import { NextResponse } from "next/server";
import { getAllPosts } from "@/utils/api/post";
import { Locale } from "@/i18n/request";
import { getAllCourses } from "@/utils/api/course";

interface GlossaryCategory {
  id: string;
  name: {
    az: string;
    ru: string;
  };
  slug: {
    az: string;
    ru: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GlossaryTerm {
  id: string;
  term: {
    az: string;
    ru: string;
  };
  slug: {
    az: string;
    ru: string;
  };
  categoryId: string;
  published: boolean;
  category: {
    name: {
      az: string;
      ru: string;
    };
  };
}

async function getGlossaryCategories(): Promise<GlossaryCategory[]> {
  try {
    const response = await fetch(
      "https://api.jetschool.az/api/glossary-categories?limit=10000",
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch glossary categories: ${response.status}`
      );
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching glossary categories:", error);
    return [];
  }
}

async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  try {
    const response = await fetch(
      "https://api.jetschool.az/api/glossary/brief?limit=10000",
      {
        headers: {
          accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch glossary terms: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching glossary terms:", error);
    return [];
  }
}

export async function GET() {
  const languages = ["az", "ru"];
  const baseUrl = "https://jetschool.az";

  const staticRoutes = [
    "/",
    "/about-us",
    "/projects",
    "/gallery",
    "/contact-us",
    "/courses",
    "/news",
    "/blog",
    "/glossary",
  ];

  const staticSitemapEntries = staticRoutes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}${route === "/" ? "" : route}`,
      lastModified: new Date().toISOString(),
      changeFrequency:
        route === "/news" || route === "/blog" || route === "/glossary"
          ? "daily"
          : route === "/projects" || route === "/gallery"
          ? "weekly"
          : "monthly",
      priority:
        route === "/"
          ? 1
          : route === "/about-us"
          ? 0.8
          : route === "/contact-us"
          ? 0.7
          : route === "/news" || route === "/blog" || route === "/glossary"
          ? 0.9
          : 0.5,
    }))
  );

  const postSitemapEntries = [];
  const blogSitemapEntries = [];
  const courseSitemapEntries = [];
  const glossaryCategorySitemapEntries = [];
  const glossaryTermSitemapEntries = [];

  try {
    const [
      postsResponse,
      blogsResponse,
      coursesResponse,
      glossaryCategories,
      glossaryTerms,
    ] = await Promise.all([
      getAllPosts({ page: 1, limit: 1000 }).catch(() => ({ items: [] })),
      getAllPosts({ page: 1, limit: 1000, type: "blog" }).catch(() => ({
        items: [],
      })),
      getAllCourses({ page: 1, limit: 1000 }).catch(() => ({ items: [] })),
      getGlossaryCategories(),
      getGlossaryTerms(),
    ]);

    for (const lang of languages) {
      for (const post of postsResponse.items || []) {
        if (post.slug?.[lang as Locale]) {
          postSitemapEntries.push({
            url: `${baseUrl}/${lang}/news/${post.slug[lang as Locale]}`,
            lastModified: new Date(post.updatedAt || new Date()).toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }

      for (const blog of blogsResponse.items || []) {
        if (blog.slug?.[lang as Locale]) {
          blogSitemapEntries.push({
            url: `${baseUrl}/${lang}/blog/${blog.slug[lang as Locale]}`,
            lastModified: new Date(blog.updatedAt || new Date()).toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }

      for (const course of coursesResponse.items || []) {
        if (course.slug?.[lang as Locale]) {
          courseSitemapEntries.push({
            url: `${baseUrl}/${lang}/course/${course.slug[lang as Locale]}`,
            lastModified: new Date(
              course.updatedAt || new Date()
            ).toISOString(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }

      for (const category of glossaryCategories) {
        if (category.slug?.[lang as Locale]) {
          glossaryCategorySitemapEntries.push({
            url: `${baseUrl}/${lang}/glossary/category/${
              category.slug[lang as Locale]
            }`,
            lastModified: new Date(
              category.updatedAt || new Date()
            ).toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }

      for (const term of glossaryTerms) {
        if (term.published && term.slug?.[lang as Locale]) {
          glossaryTermSitemapEntries.push({
            url: `${baseUrl}/${lang}/glossary/slug/${
              term.slug[lang as Locale]
            }`,
            lastModified: new Date().toISOString(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching content for sitemap:", error);
  }

  const allEntries = [
    ...staticSitemapEntries,
    ...postSitemapEntries,
    ...blogSitemapEntries,
    ...courseSitemapEntries,
    ...glossaryCategorySitemapEntries,
    ...glossaryTermSitemapEntries,
  ];

  const xmlSitemap = generateSitemapXml(allEntries);

  return new NextResponse(xmlSitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function generateSitemapXml(entries: any[]) {
  const xmlItems = entries
    .map((entry) => {
      return `
      <url>
        <loc>${entry.url}</loc>
        <lastmod>${entry.lastModified}</lastmod>
        <changefreq>${entry.changeFrequency}</changefreq>
        <priority>${entry.priority}</priority>
      </url>
    `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${xmlItems}
    </urlset>
  `;
}
