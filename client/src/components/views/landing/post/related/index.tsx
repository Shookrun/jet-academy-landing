"use client";

import { getRelatedPosts, getAllPosts } from "@/utils/api/post";
import { Post } from "@/types/post";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "@/utils/formatters/formatDate";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

interface RelatedPostsProps {
  title: string;
  locale: Locale;
  currentPostId: string;
  postType: PostType;
  tags: string[];
}

export default function RelatedPosts({
  title,
  locale,
  currentPostId,
  postType,
  tags,
}: RelatedPostsProps) {
  const t = useTranslations("blogPage");
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
  const fetchPosts = async () => {
    try {
      console.log('Fetching related posts for:', currentPostId, postType, tags);
      



      let relatedResult: Post[] = [];
      try {
        relatedResult = await getRelatedPosts({
          postId: currentPostId,
          postType,
          tags,
          limit: 6,
        });
        console.log('Related posts API result:', relatedResult.length);
      } catch (error) {
        console.warn('Related posts API failed, using fallback',error);
      }


      let filteredResult = relatedResult.filter(
        (post) => post.postType === postType && post.id !== currentPostId
      );
      console.log('Same type filtered result:', filteredResult.length);


      if (filteredResult.length < 3) {
        console.log('Not enough same type posts, fetching more...');
        
        const sameTypePosts = await getAllPosts({
          page: 1,
          limit: 20, 
          postType,
        });

        const moreSameTypePosts = sameTypePosts.items
          .filter(
            (post) =>
              post.id !== currentPostId &&
              !filteredResult.some((fp) => fp.id === post.id)
          )
          .slice(0, 6 - filteredResult.length);

        filteredResult = [...filteredResult, ...moreSameTypePosts];
        console.log('After adding more same type:', filteredResult.length);
      }


      if (filteredResult.length < 3) {
        console.log('Still not enough, adding different types...');
        
        const allPostsResult = await getAllPosts({
          page: 1,
          limit: 20,

        });

        const differentTypePosts = allPostsResult.items
          .filter(
            (post) =>
              post.id !== currentPostId &&
              !filteredResult.some((fp) => fp.id === post.id)
          )
          .slice(0, 6 - filteredResult.length);

        filteredResult = [...filteredResult, ...differentTypePosts];
        console.log('Final result with different types:', filteredResult.length);
      }

      console.log('Final posts to show:', filteredResult.map(p => ({ id: p.id, type: p.postType, title: p.title })));
      setRelatedPosts(filteredResult.slice(0, 6)); 
      
    } catch (error) {
      console.error("RelatedPosts fetch error:", error);
      

      try {
        const fallbackResult = await getAllPosts({
          page: 1,
          limit: 6,
        });
        
        const fallbackPosts = fallbackResult.items.filter(post => post.id !== currentPostId);
        setRelatedPosts(fallbackPosts.slice(0, 3));
        console.log('Using complete fallback:', fallbackPosts.length);
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError);
        setRelatedPosts([]);
      }
    }
  };

  fetchPosts();
}, [currentPostId, postType, tags, locale]);

  if (relatedPosts.length === 0) {
    return (
      <p className="text-gray-500 mt-6">
        {t("noPostsFound") || "No related posts available"}
      </p>
    );
  }

  return (
    <div className="mt-12 relative">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 flex items-center justify-center bg-[#FFF7E6] rounded-full border border-jsyellow hover:bg-jsyellow hover:text-white transition"
            aria-label="Əvvəlki"
            type="button"
          >

            <svg width="24" height="24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 flex items-center justify-center bg-[#FFF7E6] rounded-full border border-jsyellow hover:bg-jsyellow hover:text-white transition"
            aria-label="Növbəti"
            type="button"
          >

            <svg width="24" height="24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <Swiper
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1.2}

        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}

        onBeforeInit={(swiper) => {

          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          2500: { slidesPerView: 4 }, 
        }}
      >
        {relatedPosts.map((post) => (
          <SwiperSlide key={post.id}>
            <div className="h-full">
              <RelatedPostCard post={post} locale={locale} t={t} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

interface RelatedPostCardProps {
  post: Post;
  locale: Locale;
  t: (key: string) => string;
}

function RelatedPostCard({ post, locale, t }: RelatedPostCardProps) {
  const formattedDate = formatDateTime(post.createdAt);

  const getPostTypeLabel = (type: PostType) => {
    switch (type) {
      case PostType.BLOG:
        return t("blog");
      case PostType.NEWS:
        return t("news");
      case PostType.EVENT:
        return t("event");
      case PostType.OFFERS:
        return t("offers");
      default:
        return type;
    }
  };

  const contentPreview =
    (post.content?.[locale]?.replace(/<[^>]*>/g, "")?.slice(0, 100) ?? "") +
    "...";

  const postUrl = post.slug[locale]
    ? `/news/${post.slug[locale]}`
    : `/news/${post.slug["az"] || post.id}`;

  const readMoreText =
    t("readMore") || (locale === "az" ? "Daha çox oxu" : "Читать далее");

  return (
    <Link
      href={postUrl}
      className="bg-[#fef7eb] border border-jsyellow rounded-[32px] overflow-hidden 
        transition-transform duration-300  hover:shadow-lg 
        hover:shadow-[rgba(252,174,30,0.15)] flex flex-col  h-full min-h-[450px]"
    >
      {post.imageUrl && (
        <div className="w-full relative h-[200px] overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${post.imageUrl}`}
            alt={post.title[locale] || "Post image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-500">
            {formattedDate}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              post.postType === PostType.BLOG
                ? "bg-blue-100 text-blue-800"
                : post.postType === PostType.NEWS
                ? "bg-green-100 text-green-800"
                : post.postType === PostType.EVENT
                ? "bg-purple-100 text-purple-800"
                : post.postType === PostType.OFFERS
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {getPostTypeLabel(post.postType)}
          </span>
        </div>
        <h3 className="font-semibold text-xl mb-3 line-clamp-2">
          {post.title[locale] || "Title not available"}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {contentPreview}
        </p>
        <span className="text-jsyellow font-medium hover:underline">
          {readMoreText} →
        </span>
      </div>
    </Link>
  );
}
