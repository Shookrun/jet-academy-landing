import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import GlossaryTermList from "@/components/views/landing/glossary/glossary-term-list";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  let categoryName = "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary-categories/slug/${slug}`
    );
    if (res.ok) {
      const category = await res.json();
      categoryName = category.name[locale] || "";
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }

  const pageTitle = categoryName
    ? `${categoryName} | Glossariy | JET Academy`
    : "Glossariy Kateqoriyası | JET Academy";

  const canonicalUrl =
    locale === "az"
      ? `${baseUrl}/glossary/category/${slug}`
      : `${baseUrl}/${locale}/glossary/category/${slug}`;

  return {
    title: pageTitle,
    description:
      t("glossaryCategoryDescription", { category: categoryName }) ||
      `JET Academy glossariy lüğətində ${categoryName} kateqoriyasına aid terminlər`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az:
          locale === "az"
            ? `${baseUrl}/glossary/category/${slug}`
            : `${baseUrl}/az/glossary/category/${slug}`,
        ru: `${baseUrl}/ru/glossary/category/${slug}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description:
        t("glossaryCategoryDescription", { category: categoryName }) ||
        `JET Academy glossariy lüğətində ${categoryName} kateqoriyasına aid terminlər`,
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description:
        t("glossaryCategoryDescription", { category: categoryName }) ||
        `JET Academy glossariy lüğətində ${categoryName} kateqoriyasına aid terminlər`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
      },
    },
  };
}

async function getGlossaryCategory(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary-categories/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch glossary category");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading glossary category:", error);
    throw error;
  }
}

async function getTermsByCategory(categoryId: string, page = 1, limit = 24) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/glossary/category/${categoryId}?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch glossary terms");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading glossary terms by category:", error);
    return { items: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
  }
}

export default async function GlossaryCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const cookieStore = cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "az";

  const page = parseInt(searchParams.page || "1", 10);

  let category;
  try {
    category = await getGlossaryCategory(params.slug);
  } catch (error) {
    console.error("Error fetching glossary category:", error);
    notFound();
  }

  const { items: terms, meta } = await getTermsByCategory(category.id, page);

  const translations = {
    az: {
      title: `${category.name[language]} kateqoriyası`,
      categoryText: "Kateqoriya",
      emptyText: "Bu kateqoriyada termin tapılmadı",
      searchPlaceholder: "Termin axtar...",
    },
    ru: {
      title: `Категория ${category.name[language]}`,
      categoryText: "Категория",
      emptyText: "В этой категории терминов не найдено",
      searchPlaceholder: "Поиск термина...",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto px-4 py-12">

      <GlossaryTermList
        terms={terms}
        categoryName={category.name[language]}
        title={t.title}
        categoryText={t.categoryText}
        language={language}
        emptyText={t.emptyText}
      />

      {/* Pagination component could be added here */}
      {meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          {/* Your pagination component */}
        </div>
      )}
    </div>
  );
}
