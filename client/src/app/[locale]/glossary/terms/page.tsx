import GlossaryAlphabetNav from "@/components/views/landing/glossary/glossary-alphabet-nav";
import GlossaryPagination from "@/components/views/landing/glossary/glossary-pagination";
import GlossaryTermList from "@/components/views/landing/glossary/glossary-term-list";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { letter?: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const glossaryT = await getTranslations({
    locale,
    namespace: "glossary.terms",
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  const queryString = searchParams.letter
    ? `?letter=${searchParams.letter}`
    : "";

  const canonicalUrl =
    locale === "az"
      ? `${baseUrl}/glossary/terms${queryString}`
      : `${baseUrl}/${locale}/glossary/terms${queryString}`;

  const pageTitle = searchParams.letter
    ? t("glossaryTermsLetterPageTitle", { letter: searchParams.letter }) ||
      `"${searchParams.letter}" ilə başlayan terminlər | JET Academy`
    : t("glossaryTermsPageTitle") || "Bütün Terminlər | JET Academy";

  return {
    title: pageTitle,
    description:
      glossaryT("description") ||
      "JET Academy glossariy lüğətində bütün IT terminləri",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az:
          locale === "az"
            ? `${baseUrl}/glossary/terms${queryString}`
            : `${baseUrl}/az/glossary/terms${queryString}`,
        ru: `${baseUrl}/ru/glossary/terms${queryString}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description:
        glossaryT("description") ||
        "JET Academy glossariy lüğətində bütün IT terminləri",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description:
        glossaryT("description") ||
        "JET Academy glossariy lüğətində bütün IT terminləri",
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

interface SearchParams {
  letter?: string;
  page?: string;
}

async function getGlossaryTerms(letter?: string, page = 1, limit = 24) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (letter) {
      params.append("letter", letter);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch glossary terms");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading glossary terms:", error);
    return { items: [], meta: { total: 0, page: 1, limit, totalPages: 0 } };
  }
}

export default async function GlossaryTermsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: SearchParams;
}) {
  const cookieStore = cookies();
  const language = locale || cookieStore.get("NEXT_LOCALE")?.value || "az";

  const letter = searchParams.letter;
  const page = parseInt(searchParams.page || "1", 10);

  const { items: terms, meta } = await getGlossaryTerms(letter, page);
  
  const glossaryT = await getTranslations({
    locale: language,
    namespace: "glossary.terms",
  });
  const paginationT = await getTranslations({
    locale: language,
    namespace: "glossary.pagination",
  });

  const title = letter
    ? `"${letter}" ilə başlayan terminlər`
    : glossaryT("title");

  return (
    <div className="container mx-auto px-4 py-12">

      <GlossaryAlphabetNav language={language} allText={glossaryT("allText")} />

      <GlossaryTermList
        terms={terms}
        title={title}
        categoryText={glossaryT("categoryText")}
        language={language}
        emptyText={glossaryT("emptyText")}
      />

      {meta.totalPages > 1 && (
        <GlossaryPagination
          currentPage={page}
          totalPages={meta.totalPages}
          previousText={paginationT("previous")}
          nextText={paginationT("next")}
        />
      )}
    </div>
  );
}
