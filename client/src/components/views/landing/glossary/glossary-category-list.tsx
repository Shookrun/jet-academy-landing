import Link from "next/link";

interface GlossaryCategory {
  id: string;
  name: {
    az: string;
    ru: string;
  };
  description?: {
    az: string;
    ru: string;
  };
  slug: {
    az: string;
    ru: string;
  };
  _count?: {
    glossaryTerms: number;
  };
}

interface GlossaryCategoryListProps {
  categories: GlossaryCategory[];
  title: string;
  termsText: string;
  language: string; // 'az' or 'ru'
  emptyText: string;
}

export default function GlossaryCategoryList({
  categories,
  title,
  termsText,
  language,
  emptyText,
}: GlossaryCategoryListProps) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <h1 className="text-4xl font-bold leading-[1.3] text-jsblack">{title}</h1>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/glossary/category/${
                category.slug[language as keyof typeof category.slug]
              }`}
            >
              <div
                className="border h-[190.6px]  rounded-[16px] p-6 hover:shadow-md transition-shadow duration-300 cursor-pointer bg-[#fef7eb]
border-jsblack/20"
              >
                <h3 className="text-2xl font-bold text-jsblack mb-2">
                  {category.name[language as keyof typeof category.name]}
                </h3>

                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {
                      category.description[
                        language as keyof typeof category.description
                      ]
                    }
                  </p>
                )}

                <span className="bg-jsyellow/10 text-jsblack px-3 py-1 rounded-full text-sm">
                  {`${termsText}: ${category._count?.glossaryTerms || 0}`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-[16px] text-center">
          <p className="text-gray-600">{emptyText}</p>
        </div>
      )}
    </div>
  );
}
