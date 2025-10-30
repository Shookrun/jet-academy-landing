"use client";

import SectionTitle from "@/components/shared/section-title";
import { Locale } from "@/i18n/request";
import { Course, CourseResponse } from "@/types/course";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ICoursesSlider {
  courses: CourseResponse;
  locale?: Locale;
}

type L2 = "az" | "en";
const normalizeLocale = (l?: string): L2 => {
  const s = (l || "az").slice(0, 2).toLowerCase();
  return s === "en" ? "en" : "az";
};

function getML<T = string>(
  obj: unknown,
  loc: L2,
  fallbacks: L2[] = ["az", "en"]
): T | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const rec = obj as Record<L2, T | undefined>;
  return rec[loc] ?? rec[fallbacks[0]] ?? rec[fallbacks[1]];
}

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "/default-course-image.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;

  const base =
    (process.env.NEXT_PUBLIC_CDN_URL || "").replace(/\/$/, "") ||
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  if (!base) {
    if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad"))
      return imageUrl;
    return `/uploads-acad/courses/${imageUrl}`;
  }

  if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad")) {
    return `${base}${imageUrl}`;
  }
  return `${base}/uploads-acad/courses/${imageUrl}`;
};

const CoursesSlider = ({ courses, locale = "az" }: ICoursesSlider) => {
  const t = useTranslations("courseInfoCP");
  const [isClient, setIsClient] = useState(false);
  const loc = normalizeLocale(locale);

  useEffect(() => setIsClient(true), []);

  const displayCourses = Array.isArray(courses?.items) ? courses.items : [];
  if (displayCourses.length === 0) return null;

  return (
    <div className="container mx-auto my-12 sm:my-16 lg:my-20 px-0">
      <SectionTitle title={t("title")} description={t("description")} />

      <style jsx>{`
        @keyframes scroll-tags {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .scrolling-tags {
          animation: scroll-tags 15s linear infinite;
        }
        .scrolling-tags:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Swiper qatları kart içində sərbəst, amma KONTEYNER klipləyir */}
      <style jsx global>{`
        .swiper,
        .swiper-wrapper,
        .swiper-slide {
          overflow: visible !important;
        }
      `}</style>

      {/* 🔒 KONTEYNER KLİP */}
      <div className="relative overflow-hidden"> 
        {isClient ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            autoHeight
            className="py-6 overflow-visible"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 18 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 24 },
              1400: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {displayCourses.map((course: Course) => {
              const title =
                getML<string>(course.title, loc) ??
                getML<string>(course.title, "az") ??
                "Untitled Course";

              const slogan =
                getML<string>(course.slogan as unknown, loc) ??
                getML<string>(course.shortDescription as unknown, loc) ??
                (loc === "az"
                  ? "Texnologiya dünyasına ilk addımını at!"
                  : "Make your first step in tech!");

              const level =
                getML<string>(course.level as unknown, loc) ??
                getML<string>(course.level as unknown, "az") ??
                (loc === "az" ? "Başlanğıc" : "Beginner");

              const duration = course.duration || "6";
              const slug =
                getML<string>(course.slug as unknown, loc) ??
                getML<string>(course.slug as unknown, "az") ??
                "";

              const tags =
                (getML<string[]>(course.newTags as unknown, loc) ??
                  course.tag ??
                  []) as string[];

              const cardStyle = {
                backgroundColor: course.backgroundColor || "#FFE082",
                borderColor: course.borderColor || "#F59E0B",
                textColor: course.textColor || "#1A1A1A",
              };

              const href = slug ? `/${loc}/course/${slug}` : `/${loc}/courses`;

              return (
                <SwiperSlide key={course.id} className="h-auto overflow-visible">
                  <Link
                    href={href}
                    className="
                      group relative z-0 flex flex-col justify-between
                      rounded-2xl overflow-hidden
                      p-8 sm:p-10
                      min-h-[320px] sm:min-h-[340px]
                      transition-all duration-200 ease-out
                      
                      hover:shadow-xl
                      hover:z-[2]
                      transform-gpu will-change-transform
                      cursor-pointer
                    "
                    style={{
                      backgroundColor: cardStyle.backgroundColor,
                      color: cardStyle.textColor,
                      border: `2px solid ${cardStyle.borderColor}`,
                    }}
                  >
                    <div className="z-10">
                      <h2 className="text-2xl sm:text-2xl font-bold mb-3 leading-tight text-gray-900 line-clamp-2">
                        {title}
                      </h2>
                      <p className="text-base sm:text-lg opacity-80 font-medium line-clamp-2">
                        {slogan}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 text-sm sm:text-base mt-5 opacity-90">
                      <p>
                        <span className="font-semibold">
                          {loc === "az" ? "Səviyyə:" : "Level:"}
                        </span>{" "}
                        {level}
                      </p>
                      <p>
                        <span className="font-semibold">
                          {loc === "az" ? "Müddət:" : "Duration:"}
                        </span>{" "}
                        {duration} {loc === "az" ? "ay" : "months"}
                      </p>
                    </div>

                    {Array.isArray(tags) && tags.length > 0 && (
                      <div className="relative overflow-hidden mt-6 -mx-8 px-8">
                        <div className="scrolling-tags flex gap-2 w-max">
                          {[...tags, ...tags].map((tag, i) => (
                            <span
                              key={`${course.id}-${i}`}
                              className="
                                text-xs sm:text-sm px-3 py-1
                                bg-white/80
                                rounded-full font-medium
                                shadow-sm whitespace-nowrap
                              "
                              style={{ color: cardStyle.textColor }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Şəkil — konteyner kənarı ilə “flush” olub daşmasın deyə bir az içəri çəkdim */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-[118px] h-[118px] sm:w-[156px] sm:h-[156px] drop-shadow-lg pointer-events-none transition-transform duration-200 group-hover:scale-105">
                      <Image
                        src={getImageUrl(course.imageUrl)}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="156px"
                      />
                    </div>

                    {/* Dekorativ dairə — kənarı aşmaması üçün ölçü/pozisiya yığıldı */}
                    <div
                      className="absolute w-[150px] h-[150px] rounded-full opacity-30 -bottom-8 -right-8 blur-2xl pointer-events-none"
                      style={{ backgroundColor: cardStyle.borderColor }}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[320px] sm:h-[340px] rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesSlider;
