"use client";

import { useEffect, useState } from "react";
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

const PostCardClient = ({ post, locale, t }: PostCardProps) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // locale-ni sabitləyək (data'da yalnız az/ru varsa)
  const normalizedLocale = (locale?.slice(0, 2) as "az" | "ru") ?? "az";

  // Title & slug üçün sabit fallback-lər
  const title =
    (post.title as any)?.[normalizedLocale] ||
    (post.title as any)?.az ||
    (post.title as any)?.ru ||
    "";

  const rawSlug =
    (post.slug as any)?.[normalizedLocale] ||
    (post.slug as any)?.az ||
    (post.slug as any)?.ru ||
    "";

  const safeSlug = String(rawSlug || "").trim();
  const href = safeSlug ? `/news/${encodeURIComponent(safeSlug)}` : undefined;

  // Content preview
  const content = getTextContent(post.content, normalizedLocale) || "";
  const contentPreview =
    content.substring(0, 150) + (content.length > 150 ? "..." : "");

  // Şəkil URL normalizatoru (tam URL, /uploads, fallback)
  const getImageUrl = (imageUrl?: string | null) => {
    if (!imageUrl) return null;
    // Tam URL verilmişsə
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    // /uploads ilə başlayırsa CDN/API ilə birləşdir
    if (imageUrl.startsWith("/uploads")) {
      const base =
        process.env.NEXT_PUBLIC_CDN_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api.jetschool.az";
      return `${base.replace(/\/+$/, "")}${imageUrl}`;
    }

    // Nisbi başqa yol verilibsə, mümkün CDN ilə birləşdir
    const cdn = process.env.NEXT_PUBLIC_CDN_URL || "";
    if (cdn) return `${cdn.replace(/\/+$/, "")}/${imageUrl.replace(/^\/+/, "")}`;

    // Əks halda olduğu kimi
    return imageUrl;
  };

  const imgSrc = getImageUrl(post.imageUrl);

  // SSR skeleton (istəsən saxlayarsan)
  if (!isClient) {
    return (
      <div className="bg-[#fef7eb] border border-jsyellow rounded-3xl h-[360px] animate-pulse" />
    );
  }

  const Card = href ? Link : "div";
  const cardProps = href ? { href } : {};

  return (
    <Card
      {...(cardProps as any)}
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
            src={imgSrc}
            alt={typeof title === "string" ? title : "Post image"}
            fill
            quality={90}
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 [@media(min-width:3500px)]:!text-xl">
            {formatDateTime(post.createdAt)}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 [@media(min-width:3500px)]:!text-4xl line-clamp-2">
          {typeof title === "string" ? title : ""}
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
              {post.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
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
    </Card>
  );
};

export default PostCardClient;
