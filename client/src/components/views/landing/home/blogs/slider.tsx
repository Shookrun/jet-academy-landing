"use client";

import { Locale } from "@/i18n/request";
import { Post, PostsResponse } from "@/types/post";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PostCard from "../../post/card";

interface SliderProps {
  data: PostsResponse;
}

export default function PostsSlider({ data }: SliderProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("postsPage");

  return (
    <div className="py-4 4xl:py-6 ">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        spaceBetween={24}
        breakpoints={{
          0:    { slidesPerView: 1 },
          640:  { slidesPerView: 2 },
          992:  { slidesPerView: 3 },
          2560: { slidesPerView: 4 },
          3540: { slidesPerView: 4 },
        }}
        className="!pb-4 4xl:!pb-6"
      >
     {data.items.map((post: Post, idx: number) => (
  <SwiperSlide
    key={idx}
    className="!h-auto flex items-stretch"
  >
    <motion.div className="w-full h-full flex">
      <PostCard t={t} locale={locale} post={post} />
    </motion.div>
  </SwiperSlide>
))}

      </Swiper>
    </div>
  );
}
