"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface GlossaryPaginationProps {
  currentPage: number;
  totalPages: number;
  previousText: string;
  nextText: string;
}

export default function GlossaryPagination({
  currentPage,
  totalPages,
  previousText,
  nextText,
}: GlossaryPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const visiblePages: number[] = [];
    const showAroundCurrent = 1;

    visiblePages.push(1);

    for (
      let i = Math.max(2, currentPage - showAroundCurrent);
      i <= Math.min(totalPages - 1, currentPage + showAroundCurrent);
      i++
    ) {
      visiblePages.push(i);
    }

    if (totalPages > 1) {
      visiblePages.push(totalPages);
    }

    return [...new Set(visiblePages)].sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  const renderPageNumbers = () => {
    const result = [];
    let lastPage = 0;

    for (const page of visiblePages) {
      if (page - lastPage > 1) {
        result.push(
          <span
            key={`ellipsis-${page}`}
            className="px-4 py-2 text-gray-400 select-none"
          >
            ...
          </span>
        );
      }

      result.push(
        <Link
          key={page}
          href={createPageURL(page)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            currentPage === page
              ? "bg-jsyellow text-white"
              : "bg-jsyellow/10 text-jsblack hover:bg-jsyellow/20"
          }`}
        >
          {page}
        </Link>
      );

      lastPage = page;
    }

    return result;
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Link
          href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
            currentPage > 1
              ? "bg-jsyellow/10 text-jsblack hover:bg-jsyellow/20"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={currentPage <= 1}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          onClick={(e) => {
            if (currentPage <= 1) e.preventDefault();
          }}
        >
          <MdChevronLeft className="mr-1" />
          {previousText}
        </Link>

        {/* Page numbers */}
        <div className="flex items-center gap-2 mx-2">
          {renderPageNumbers()}
        </div>

        {/* Next button */}
        <Link
          href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
            currentPage < totalPages
              ? "bg-jsyellow/10 text-jsblack hover:bg-jsyellow/20"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={currentPage >= totalPages}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          onClick={(e) => {
            if (currentPage >= totalPages) e.preventDefault();
          }}
        >
          {nextText}
          <MdChevronRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
