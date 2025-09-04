import Link from "next/link";

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
  categoryId?: string;
  category?: {
    name: {
      az: string;
      ru: string;
    };
  };
}

interface GlossaryTermListProps {
  terms: GlossaryTerm[];
  categoryName?: string;
  title: string;
  categoryText: string;
  language: string; // 'az' or 'ru'
  emptyText: string;
}

export default function GlossaryTermList({
  terms,
  categoryName,
  title,
  categoryText,
  language,
  emptyText,
}: GlossaryTermListProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 animate-fadeIn">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.3] text-jsblack [@media(min-width:3500px)]:!text-5xl">
        {title}
      </h1>

      {categoryName && (
        <div className="flex items-center gap-4 mb-2 sm:mb-3 lg:mb-4">
          <span className="bg-jsyellow/10 text-jsblack px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm sm:text-base [@media(min-width:3500px)]:!text-2xl">
            {`${categoryText}: ${categoryName}`} 
          </span>
        </div>
      )}

      {terms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [@media(min-width:2500px)]:!grid-cols-4 [@media(min-width:3000px)]:!grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {terms.map((term) => (
            <Link
              key={term.id}
              href={`/glossary/term/${
                term.slug[language as keyof typeof term.slug]
              }`}
            >
              <div className="border rounded-xl sm:rounded-2xl lg:rounded-[16px] p-3 sm:p-4 lg:p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-[#fef9e7] border-jsblack/20">
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-jsblack mb-1 sm:mb-2 [@media(min-width:3500px)]:!text-3xl">
                  {term.term[language as keyof typeof term.term]} 
                </h3>

                {term.category && (
                  <span className="bg-jsyellow/10 text-jsblack px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm [@media(min-width:3500px)]:!text-xl">
                    {
                      term.category.name[
                        language as keyof typeof term.category.name
                      ]
                    }
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl lg:rounded-[16px] text-center">
          <p className="text-gray-600 text-sm sm:text-base [@media(min-width:3500px)]:!text-2xl">
            {emptyText}
          </p>
        </div>
      )}
    </div>
  );
}