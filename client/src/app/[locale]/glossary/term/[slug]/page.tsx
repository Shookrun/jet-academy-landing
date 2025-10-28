import GlossaryContact from "@/components/views/landing/glossary/glossary-contact";
import GlossaryTermDetail from "@/components/views/landing/glossary/glossary-term-detail";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  let termName = "";
  let termDefinition = "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary/slug/${slug}`
    );
    if (res.ok) {
      const term = await res.json();
      termName = term.term[locale] || "";
      termDefinition = term.definition[locale]
        ? term.definition[locale].replace(/<[^>]*>/g, "").substring(0, 160)
        : "";
    }
  } catch (error) {
    console.error("Error fetching term:", error);
  }

  const pageTitle = termName ? `${termName}` : "Glossariy Termini | JET Academy";

  const canonicalUrl = `${baseUrl}/${locale}/glossary/term/${slug}`;

  return {
    title: pageTitle,
    description:
      termDefinition ||
      t("glossaryTermDefaultDescription") ||
      "IT və proqramlaşdırma termini haqqında məlumat",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}/az/glossary/term/${slug}`,
        ru: `${baseUrl}/ru/glossary/term/${slug}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description:
        termDefinition ||
        t("glossaryTermDefaultDescription") ||
        "IT və proqramlaşdırma termini haqqında məlumat",
      url: canonicalUrl,
      type: "article",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description:
        termDefinition ||
        t("glossaryTermDefaultDescription") ||
        "IT və proqramlaşdırma termini haqqında məlumat",
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

async function getGlossaryTerm(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch glossary term");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading glossary term:", error);
    throw error;
  }
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { locale, slug } = params;
  const cookieStore = cookies();
  const language = locale || cookieStore.get("NEXT_LOCALE")?.value || "az";

  let term;
  try {
    term = await getGlossaryTerm(slug);
  } catch (error) {
    console.error("Error fetching term:", error);
    notFound();
  }

  const termContent = term.term[language];
  const definitionContent = term.definition[language];

  const categoryName = term.category?.name[language];
  const categorySlug = term.category?.slug[language];

  const glossaryT = await getTranslations({
    locale: language,
    namespace: "glossary.term",
  });

  return (
    <div className="container flex flex-col gap-8 lg:gap-4 mx-auto px-4 py-12">
      <GlossaryTermDetail
        term={termContent}
        definition={definitionContent}
        categoryName={categoryName}
        categorySlug={categorySlug}
        tags={term.tags || []}
        relatedTerms={term.relatedTermsData || []}
        tagsText={glossaryT("tagsText")}
        categoryText={glossaryT("categoryText")}
        relatedTermsText={glossaryT("relatedTermsText")}
        language={language}
      />
      <GlossaryContact language={language} />
    </div>
  );
}
