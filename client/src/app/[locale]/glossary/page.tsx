import GlossaryPage from "@/components/views/landing/glossary/glossary-page";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const glossaryT = await getTranslations({ locale, namespace: "glossary" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  const canonicalUrl =
    locale === "az" ? `${baseUrl}/glossary` : `${baseUrl}/${locale}/glossary`;

  return {
    title: t("glossaryPageTitle") || "Glossariy | JET Academy",
    description:
      glossaryT("subtitle") || "IT və proqramlaşdırma terminləri lüğəti",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: locale === "az" ? `${baseUrl}/glossary` : `${baseUrl}/az/glossary`,
        en: `${baseUrl}/en/glossary`,
      },
    },
    openGraph: {
      title: t("glossaryPageTitle") || "Glossariy | JET Academy",
      description:
        glossaryT("subtitle") || "IT və proqramlaşdırma terminləri lüğəti",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "en_US",
      alternateLocale: locale === "az" ? "en_US" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("glossaryPageTitle") || "Glossariy | JET Academy",
      description:
        glossaryT("subtitle") || "IT və proqramlaşdırma terminləri lüğəti",
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

async function getGlossaryCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/glossary-categories`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch glossary categories");
    }

    return res.json();
  } catch (error) {
    console.error("Error loading glossary categories:", error);
    return [];
  }
}

export default async function GlossaryIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const cookieStore = cookies();
  const language = locale || cookieStore.get("NEXT_LOCALE")?.value || "az";

  const categories = await getGlossaryCategories();
  const glossaryT = await getTranslations({
    locale: language,
    namespace: "glossary",
  });

  return (
    <GlossaryPage
      categories={categories}
      language={language}
      title={glossaryT("title")}
      subtitle={glossaryT("subtitle")}
      searchPlaceholder={glossaryT("searchPlaceholder")}
      allTermsText={glossaryT("allTermsText")}
      categoriesTitle={glossaryT("categoriesTitle")}
      termsText={glossaryT("termsText")}
      emptyText={glossaryT("emptyText")}
    />
  );
}
