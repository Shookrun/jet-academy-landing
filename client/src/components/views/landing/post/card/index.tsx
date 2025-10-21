import { Locale } from "@/i18n/request";
import { Post } from "@/types/post";
import { formatDateTime } from "@/utils/formatters/formatDate";
import { getTextContent } from "@/utils/helpers/post";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  locale: Locale;
  t: (k: string) => string;
}

function buildImageSrc(imageUrl?: string | null) {
  if (!imageUrl) return null;
  // Tam URL gəlirsə, birbaşa istifadə et
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const cdn = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/+$/, "");
  if (!cdn) return null; // CDN yoxdursa SSR-də Image error olmasın deyə render etməyək
  return `${cdn}/${imageUrl.replace(/^\/+/, "")}`;
}

export default function PostCard({ post, locale, t }: PostCardProps) {
  const formattedDate = formatDateTime(post.createdAt);

  const titleFromLocale =
    (post.title && (post.title as any)[locale]) ||
    (post.title && (post.title as any).az) ||
    (post.title && (post.title as any).en) ||
    (post.title && (post.title as any).ru) ||
    "";

  const slugFromLocale =
    (post.slug && (post.slug as any)[locale]) ||
    (post.slug && (post.slug as any).az) ||
    (post.slug && (post.slug as any).en) ||
    (post.slug && (post.slug as any).ru) ||
    "";

  const safeSlug = encodeURIComponent(String(slugFromLocale || "").trim());
  const hasValidSlug = Boolean(safeSlug);

  const content = getTextContent(post.content, locale) || "";
  const contentPreview =
    content.substring(0, 150) + (content.length > 150 ? "..." : "");

  const imgSrc = buildImageSrc(post.imageUrl || undefined);

  // slug yoxdursa, link verməyək ki, /news/undefined getməsin
  const Wrapper: React.ElementType = hasValidSlug ? Link : "div";
  const wrapperProps = hasValidSlug
    ? { href: `/news/${safeSlug}` }
    : { role: "article", "aria-label": "post-card" };

  return (
    <Wrapper
      {...wrapperProps}
      className="bg-[#fef7eb] border border-jsyellow rounded-3xl overflow-hidden 
      flex flex-col h-full transition-all duration-300  
      hover:shadow-lg hover:shadow-[rgba(252,174,30,0.15)]"
    >
      {imgSrc && (
        <div
          className="
            w-full relative overflow-hidden
            aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] 
            [@media(min-width:3500px)]:aspect-[21/9]
          "
        >
          <Image
            quality={90}
            src={imgSrc}
            alt={typeof titleFromLocale === "string" ? titleFromLocale : "Post image"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            // priority? -> istəsən listin ilk kartlarında priority verə bilərsən
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
          {typeof titleFromLocale === "string" ? titleFromLocale : ""}
        </h2>

        <p className="text-gray-600 [@media(min-width:3500px)]:!text-2xl mb-4 line-clamp-3 flex-grow">
          {contentPreview}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-jsyellow [@media(min-width:3500px)]:!text-2xl font-medium hover:underline">
            {t("readMore")} →
          </span>

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end">
              {post.tags.slice(0, 2).map((tag, index) => (
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
    </Wrapper>
  );
}
