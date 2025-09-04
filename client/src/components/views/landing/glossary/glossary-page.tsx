import Link from "next/link";
import GlossaryCategoryList from "./glossary-category-list";

interface GlossaryPageProps {
  categories: any[];
  language: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  allTermsText: string;
  categoriesTitle: string;
  termsText: string;
  emptyText: string;
}

export default function GlossaryPage({
  categories,
  language,
  title,
  subtitle,
  allTermsText,
  categoriesTitle,
  termsText,
  emptyText,
}: GlossaryPageProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold leading-[1.3] text-jsblack mb-4">
          {title}
        </h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">{subtitle}</p>
      </div>



      <div className="flex justify-center mb-12">
        <Link href="/glossary/terms">
          <span className="bg-jsyellow text-jsblack px-6 py-3 rounded-full text-base font-medium hover:bg-jsyellow/90 transition-colors duration-300">
            {allTermsText}
          </span>
        </Link>
      </div>

      <GlossaryCategoryList
        categories={categories}
        title={categoriesTitle}
        termsText={termsText}
        language={language}
        emptyText={emptyText}
      />
    </div>
  );
}
