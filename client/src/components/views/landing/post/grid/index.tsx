import { Post } from "@/types/post";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import Pagination from "@/components/ui/pagination";
import PostCard from "../card";

interface PostGridProps {
  posts: Post[];
  locale: Locale;
  t: any;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  type?: PostType;
}

export default function PostGrid({
  posts,
  locale,
  t,
  meta,
  type,
}: PostGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          {t("noPostsFound")}
        </h3>
        <p className="text-gray-500">{t("tryDifferentFilters")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [@media(min-width:2500px)]:grid-cols-4">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} locale={locale} t={t} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={meta.page!}
            totalPages={meta.totalPages!}
            baseUrl={`/news/category/${type ? `${type}/` : ""}`}
          />
        </div>
      )}
    </>
  );
}
