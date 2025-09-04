import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import GlossaryTermDetail from "@/components/views/landing/glossary/glossary-term-detail";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const cookieStore = cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "az";

  try {
    const term = await getGlossaryTerm(params.slug);

    return {
      title: `${term.term[language]}`,
      description: term.definition[language]?.substring(0, 160) || "",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Glossary Term | JET School",
      description: "IT terminology glossary",
    };
  }
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
  const cookieStore = cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "az";

  let term;
  try {
    term = await getGlossaryTerm(params.slug);
  } catch (error) {
    console.error("Error fetching glossary term:", error);
    notFound();
  }

  const termContent = term.term[language];
  const definitionContent = term.definition[language];

  const categoryName = term.category?.name[language];
  const categorySlug = term.category?.slug[language];

  const translations = {
    az: {
      tagsText: "Teqlər",
      categoryText: "Kateqoriya",
      relatedTermsText: "Əlaqəli terminlər",
    },
    ru: {
      tagsText: "Теги",
      categoryText: "Категория",
      relatedTermsText: "Связанные термины",
    },
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto px-4 py-12">
      <GlossaryTermDetail
        term={termContent}
        definition={definitionContent}
        categoryName={categoryName}
        categorySlug={categorySlug}
        tags={term.tags || []}
        relatedTerms={term.relatedTermsData || []}
        tagsText={t.tagsText}
        categoryText={t.categoryText}
        relatedTermsText={t.relatedTermsText}
        language={language}
      />
    </div>
  );
}
