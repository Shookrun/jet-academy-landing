import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: (number | string)[] = [];

    range.push(1);

    if (totalPages <= 1 + 2 * delta) {
      for (let i = 2; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (typeof range[0] === "number" && range[0] > 2) {
        range.unshift("dots1");
      }
      if (
        typeof range[range.length - 1] === "number" &&
        (range[range.length - 1] as number) < totalPages - 1
      ) {
        range.push("dots2");
      }

      if (range[range.length - 1] !== totalPages) {
        range.push(totalPages);
      }
    }

    return range;
  };

  const pages = getPageNumbers();

  const getPageUrl = (page: number): string => {
    return `${baseUrl}page=${page}`;
  };

  const prevPageUrl = currentPage > 1 ? getPageUrl(currentPage - 1) : null;
  const nextPageUrl =
    currentPage < totalPages ? getPageUrl(currentPage + 1) : null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous page button */}
      {prevPageUrl ? (
        <Link
          href={prevPageUrl}
          className="flex items-center justify-center h-10 w-10 rounded-full border border-jsyellow text-jsblack hover:bg-jsyellow/10 transition-colors"
          aria-label="Previous page"
        >
          <MdChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-300 cursor-not-allowed">
          <MdChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === "dots1" || page === "dots2") {
          return (
            <span
              key={`dots-${index}`}
              className="flex items-center justify-center h-10 w-10 text-gray-600"
            >
              ...
            </span>
          );
        }

        return (
          <Link
            key={`page-${page}`}
            href={getPageUrl(page as number)}
            className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
              currentPage === page
                ? "bg-jsyellow text-white"
                : "border border-jsyellow text-jsblack hover:bg-jsyellow/10"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next page button */}
      {nextPageUrl ? (
        <Link
          href={nextPageUrl}
          className="flex items-center justify-center h-10 w-10 rounded-full border border-jsyellow text-jsblack hover:bg-jsyellow/10 transition-colors"
          aria-label="Next page"
        >
          <MdChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span className="flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 text-gray-300 cursor-not-allowed">
          <MdChevronRight className="w-5 h-5" />
        </span>
      )}
    </div>
  );
}
