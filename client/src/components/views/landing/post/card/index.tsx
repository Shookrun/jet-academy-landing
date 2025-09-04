import { Locale } from "@/i18n/request";
import { Post } from "@/types/post";
import { formatDateTime } from "@/utils/formatters/formatDate";
import { getTextContent } from "@/utils/helpers/post";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  locale: Locale;
  t: any;
}

export default function PostCard({ post, locale, t }: PostCardProps) {
  const formattedDate = formatDateTime(post.createdAt);
  const title = post.title[locale];
  const slug = post.slug[locale];

  const content = getTextContent(post.content, locale);
  const contentPreview =
    content.substring(0, 150) + (content.length > 150 ? "..." : "");

  return (
<Link
  href={`/news/${slug}`}
  className="bg-[#fef7eb] border border-jsyellow rounded-3xl overflow-hidden 
    flex flex-col h-full transition-all duration-300  
    hover:shadow-lg hover:shadow-[rgba(252,174,30,0.15)]"
>
  {post.imageUrl && post.imageUrl !== "string" && (
    <div
      className="
        w-full relative overflow-hidden
        aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] 
        [@media(min-width:3500px)]:aspect-[21/9]
      "
    >
      <Image
        quality={100}
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/` + post.imageUrl}
        alt={typeof title === "string" ? title : "Post image"}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  )}

  <div className="p-6 flex flex-col flex-grow">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm text-gray-500 [@media(min-width:3500px)]:!text-xl">
        {formattedDate}
      </span>
    </div>

    <h2 className="text-xl font-bold mb-3 [@media(min-width:3500px)]:!text-4xl line-clamp-2">
      {typeof title === "string" ? title : title?.["title[az]"] || ""}
    </h2>

    <p className="text-gray-600 [@media(min-width:3500px)]:!text-2xl mb-4 line-clamp-3 flex-grow">
      {contentPreview}
    </p>

    <div className="mt-auto flex items-center justify-between">
      <span className="text-jsyellow [@media(min-width:3500px)]:!text-2xl font-medium hover:underline">
        {t("readMore")} →
      </span>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-end">
          {post.tags.slice(0, 1).map((tag, index) => (
            <span
              key={index}
              className="bg-jsyellow/10 text-jsblack px-2 py-1 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="bg-jsyellow/10 text-jsblack px-2 py-1 text-xs rounded-full">
              +{post.tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
</Link>


  );
}
