import GlossarySearch from "@/components/views/landing/glossary/glossary-search";
import GlossaryTermList from "@/components/views/landing/glossary/glossary-term-list";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

interface SearchParams {
  q?: string;
  page?: string;
}

export async function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";
  const query = searchParams.q || "";

  const pageTitle = query
    ? t("glossarySearchResultsTitle", { query }) ||
      `"${query}" üçün axtarış nəticələri | JET Academy`
    : t("glossarySearchPageTitle") || "Axtarış | JET Academy";

  const canonicalUrl =
    locale === "az"
      ? `${baseUrl}/glossary/search`
      : `${baseUrl}/${locale}/glossary/search`;

  return {
    title: pageTitle,
    description:
      t("glossarySearchDescription") ||
      "JET Academy glossariy lüğətində axtarış edin",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az:
          locale === "az"
            ? `${baseUrl}/glossary/search`
            : `${baseUrl}/az/glossary/search`,
        en: `${baseUrl}/en/glossary/search`,
      },
    },
    openGraph: {
      title: pageTitle,
      description:
        t("glossarySearchDescription") ||
        "JET Academy glossariy lüğətində axtarış edin",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "en_US",
      alternateLocale: locale === "az" ? "en_US" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description:
        t("glossarySearchDescription") ||
        "JET Academy glossariy lüğətində axtarış edin",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

async function searchGlossaryTerms(query: string, page = 1, limit = 24) {
  if (!query) {
    return { items: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
  }

  try {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary/search?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to search glossary terms");
    }

    return res.json();
  } catch (error) {
    console.error("Error searching glossary terms:", error);
    return { items: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
  }
}

export default async function GlossarySearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "az";

  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1", 10);

  const { items: terms, meta } = await searchGlossaryTerms(query, page);

  const translations = {
    az: {
      title: `"${query}" üçün axtarış nəticələri`,
      noQueryTitle: "Axtarış",
      categoryText: "Kateqoriya",
      emptyText: "Axtarışınıza uyğun termin tapılmadı",
      searchPlaceholder: "Termin axtar...",
    },
    en: {
      title: `Search results for "${query}"`,
      noQueryTitle: "Search",
      categoryText: "Category",
      emptyText: "No terms found for your search",
      searchPlaceholder: "Search term...",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto px-4 py-12">
      <GlossarySearch
        placeholderText={t.searchPlaceholder}
        initialQuery={query}
      />

      <GlossaryTermList
        terms={terms}
        title={query ? t.title : t.noQueryTitle}
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
