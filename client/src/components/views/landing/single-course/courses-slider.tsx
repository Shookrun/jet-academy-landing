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

/** yalnız az|en */
type L2 = "az" | "en";
const normalizeLocale = (l?: string): L2 => {
  const s = (l || "az").slice(0, 2).toLowerCase();
  return s === "en" ? "en" : "az";
};

/** ML oxuma helper: MultilingualContent (az/en) üçün type-safe çıxarış */
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

  const displayCourses = courses?.items ?? [];
  if (!Array.isArray(displayCourses) || displayCourses.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title={t("title")} />

      {/* container-dan çölə çıxmasın */}
      <div className="relative overflow-hidden">
        {isClient ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            className="swiper-courses py-8"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 16,
                slidesOffsetBefore: 16,
                slidesOffsetAfter: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
                slidesOffsetBefore: 20,
                slidesOffsetAfter: 20,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 24,
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 24,
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 24,
                slidesOffsetBefore: 24,
                slidesOffsetAfter: 24,
              },
            }}
            watchOverflow
          >
            {displayCourses.map((course: Course) => {
              // ML sahələri təhlükəsiz oxu
              const title =
                getML<string>(course.title, loc) ??
                getML<string>(course.title, "az") ??
                "Course";
              const shortDesc =
                getML<string>(course.shortDescription, loc) ??
                (loc === "az"
                  ? "Texnologiya dünyasına ilk addımını at!"
                  : "Make your first step into tech!");
              const level =
                getML<string>(course.level, loc) ??
                getML<string>(course.level, "az") ??
                "";
              const slug =
                getML<string>(course.slug, loc) ??
                getML<string>(course.slug, "az") ??
                "";
              const tags =
                getML<string[]>(course.newTags as unknown, loc) ??
                course.tag ??
                [];

              const cardStyle = {
                backgroundColor: course.backgroundColor || "#FEF3C7",
                borderColor: course.borderColor || "#F59E0B",
                color: course.textColor || "#1F2937",
              };

              const href = slug
                ? `/${loc}/course/${slug}`
                : `/${loc}/courses`;

              return (
                <SwiperSlide key={course.id} className="h-full">
                  {/* wrapper padding → hover effekti vizualdır, layout dəyişmir */}
                  <div className="p-1">
                    <Link
                      href={href}
                      className="
                        group relative block w-full
                        rounded-[32px] overflow-hidden border-2
                        transition-shadow duration-300
                        hover:shadow-lg hover:shadow-black/20
                      "
                      style={{
                        backgroundColor: cardStyle.backgroundColor,
                        borderColor: cardStyle.borderColor,
                        color: cardStyle.color,
                      }}
                    >
                      {/* İçdə hover effekti: translate-y + shadow (scale YOX) */}
                      <div className="relative z-10 p-6 min-h-[460px] [@media(min-width:3500px)]:min-h-[450px] transition-transform duration-300 will-change-transform group-hover:-translate-y-1">
                        {/* Dekorativ dairə - kart içində qalır */}
                        <div
                          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-60 pointer-events-none"
                          style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                        />

                        <div className="relative z-20 flex flex-col gap-3 pb-4">
                          <div>
                            <h2 className="text-2xl font-bold [@media(min-width:3500px)]:text-4xl leading-tight mb-1">
                              {title}
                            </h2>
                            <p
                              className="text-base [@media(min-width:3500px)]:text-2xl"
                              style={{ color: course.textColor || "#1F2937" }}
                            >
                              {shortDesc}
                            </p>
                          </div>

                          <div className="space-y-2 mt-3">
                            {course.ageRange && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor: course.borderColor || "#F59E0B",
                                  }}
                                >
                                  <svg
                                    className="w-3 h-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <span
                                  className="text-base [@media(min-width:3500px)]:text-2xl"
                                  style={{ color: course.textColor || "#1F2937" }}
                                >
                                  <span className="font-semibold [@media(min-width:3500px)]:text-2xl">
                                    {loc === "az" ? "Yaş:" : "Age:"}
                                  </span>{" "}
                                  {course.ageRange}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: course.borderColor || "#F59E0B",
                                }}
                              >
                                <svg
                                  className="w-3 h-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span
                                className="text-base [@media(min-width:3500px)]:text-2xl"
                                style={{ color: course.textColor || "#1F2937" }}
                              >
                                <span className="font-semibold ">
                                  {loc === "az" ? "Səviyyə:" : "Level:"}
                                </span>{" "}
                                {level}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: course.borderColor || "#F59E0B",
                                }}
                              >
                                <svg
                                  className="w-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span
                                className="text-base [@media(min-width:3500px)]:text-2xl"
                                style={{ color: course.textColor || "#1F2937" }}
                              >
                                <span className="font-semibold">
                                  {loc === "az" ? "Müddət:" : "Duration:"}
                                </span>{" "}
                                {course.duration} {loc === "az" ? "ay" : "months"}
                              </span>
                            </div>
                          </div>

                          {Array.isArray(tags) && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {tags.slice(0, 4).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-sm bg-white px-3 py-1.5 rounded-full shadow-sm font-medium [@media(min-width:3500px)]:text-xl"
                                  style={{
                                    color: course.textColor || "#1F2937",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                              {tags.length > 4 && (
                                <span
                                  className="text-sm px-3 [@media(min-width:3500px)]:text-xl py-1.5 bg-white/90 rounded-full"
                                  style={{ color: course.textColor || "#1F2937" }}
                                >
                                  +{tags.length - 4} {loc === "az" ? "daha" : "more"}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* şəkil: sabit qutu, overflow gizli → daşma YOX */}
                        <div className="absolute bottom-0 right-0 z-40 pointer-events-none">
                          <div className="relative w-[180px] h-[180px] overflow-hidden">
                            <Image
                              src={getImageUrl(course.imageUrl)}
                              alt={title}
                              fill
                              className="object-contain"
                              sizes="180px"
                              priority={false}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[280px] rounded-[32px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesSlider;
