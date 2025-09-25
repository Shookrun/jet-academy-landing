"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/components/shared/section-title";
import { Locale } from "@/i18n/request";
import { Course, CourseResponse } from "@/types/course";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ICoursesSlider {
  courses: CourseResponse;
  locale?: Locale;
}

const CoursesSlider = ({ courses, locale = "az" }: ICoursesSlider) => {
  const t = useTranslations("courseInfo");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayCourses = courses.items;
  if (!displayCourses) return null;

  const normalizedLocale = locale.slice(0, 2) as "az" | "ru";

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/default-course-image.jpg"; 
    
    // Remove hardcoded HTTP to HTTPS conversion since backend now generates correct URLs
    
    if (imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith("/uploads")) {
      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.new.jetacademy.az";
      return cdnUrl.replace(/\/uploads$/, "") + imageUrl;
    }
    
    return imageUrl;
  };

  return (
    <div className="container mx-auto my-12 sm:my-16 lg:my-20 [@media(min-width:2500px)]:my-24 [@media(min-width:3500px)]:my-32 p-0">
      <SectionTitle title={t("title")} description={t("description")} />

      <style jsx>{`
        @keyframes scroll-tags {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .scrolling-tags {
          animation: scroll-tags 15s linear infinite;
        }
        .scrolling-tags:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative">
        {isClient ? (
          <div
            className="
              grid grid-cols-1 md:grid-cols-2
              gap-4 sm:gap-6 lg:gap-8 [@media(min-width:2500px)]:gap-10 [@media(min-width:3500px)]:gap-12
              py-3 sm:py-4 lg:py-6 [@media(min-width:2500px)]:py-8 [@media(min-width:3500px)]:py-10
              [@media(min-width:2500px)]:grid-cols-4
            "
          >
            {displayCourses.map((course: Course) => {
              const tags =
                course.newTags?.[normalizedLocale] ??
                course.tag ??
                [];

              const cardStyle = {
                backgroundColor: course.backgroundColor || "#FEF3C7",
                borderColor: course.borderColor || "#F59E0B",
                color: course.textColor || "#1F2937",
              };

              const shortDesc = course.shortDescription?.[normalizedLocale] || 
                (normalizedLocale === "az" ? "Texnologiya dünyasına ilk addımını at!" : "Сделай первый шаг в мир технологий!");

              return (
                <Link
                  key={course.id}
                  href={`/${normalizedLocale}/course/${course.slug[normalizedLocale]}`}
                  className="
                    relative flex flex-col
                    w-full border-2 
                    rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden
                    p-4 sm:p-5 lg:p-6 [@media(min-width:2500px)]:p-8 [@media(min-width:3500px)]:p-10
                    min-h-[300px] sm:min-h-[320px] md:min-h-[340px] [@media(min-width:2500px)]:min-h-[400px] [@media(min-width:3500px)]:min-h-[480px]
                    justify-between
                    transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                    group
                  "
                  style={{
                    backgroundColor: cardStyle.backgroundColor,
                    borderColor: cardStyle.borderColor,
                    color: cardStyle.color,
                  }}
                >
                  <div 
                    className="absolute -top-8 sm:-top-10 lg:-top-12 [@media(min-width:2500px)]:-top-16 [@media(min-width:3500px)]:-top-20 -right-8 sm:-right-10 lg:-right-12 [@media(min-width:2500px)]:-right-16 [@media(min-width:3500px)]:-right-20 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 [@media(min-width:2500px)]:w-40 [@media(min-width:2500px)]:h-40 [@media(min-width:3500px)]:w-48 [@media(min-width:3500px)]:h-48 rounded-full opacity-60" 
                    style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                  />
                  
                  <div className="relative z-20 flex flex-col gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-5 pb-3 sm:pb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl [@media(min-width:2500px)]:text-3xl [@media(min-width:3500px)]:text-4xl font-bold leading-tight mb-1 sm:mb-2 text-black">
                        {course.title[normalizedLocale]}
                      </h2>
                      <p className="text-sm sm:text-base [@media(min-width:2500px)]:text-xl [@media(min-width:3500px)]:text-2xl leading-relaxed" style={{ color: course.textColor || "#1F2937" }}>
                        {shortDesc}
                      </p>
                    </div>

                    <div className="space-y-1 sm:space-y-2 [@media(min-width:2500px)]:space-y-3 [@media(min-width:3500px)]:space-y-4 mt-2 sm:mt-3">
                      {course.ageRange && (
                        <div className="flex items-center gap-2 [@media(min-width:2500px)]:gap-3 [@media(min-width:3500px)]:gap-4">
                          <div 
                            className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:w-6 [@media(min-width:2500px)]:h-6 [@media(min-width:3500px)]:w-7 [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                          >
                            <svg className="w-2 h-2 sm:w-3 sm:h-3 [@media(min-width:2500px)]:w-4 [@media(min-width:2500px)]:h-4 [@media(min-width:3500px)]:w-5 [@media(min-width:3500px)]:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base [@media(min-width:2500px)]:text-lg [@media(min-width:3500px)]:text-xl" style={{ color: course.textColor || "#1F2937" }}>
                            <span className="font-semibold">{normalizedLocale === "az" ? "Yaş:" : "Возраст:"}</span> {course.ageRange}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 [@media(min-width:2500px)]:gap-3 [@media(min-width:3500px)]:gap-4">
                        <div 
                          className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:w-6 [@media(min-width:2500px)]:h-6 [@media(min-width:3500px)]:w-7 [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                        >
                          <svg className="w-2 h-2 sm:w-3 sm:h-3 [@media(min-width:2500px)]:w-4 [@media(min-width:2500px)]:h-4 [@media(min-width:3500px)]:w-5 [@media(min-width:3500px)]:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm sm:text-base [@media(min-width:2500px)]:text-lg [@media(min-width:3500px)]:text-xl" style={{ color: course.textColor || "#1F2937" }}>
                          <span className="font-semibold">{normalizedLocale === "az" ? "Səviyyə:" : "Уровень:"}</span> {course.level[normalizedLocale]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 [@media(min-width:2500px)]:gap-3 [@media(min-width:3500px)]:gap-4">
                        <div 
                          className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:w-6 [@media(min-width:2500px)]:h-6 [@media(min-width:3500px)]:w-7 [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                        >
                          <svg className="w-2 h-2 sm:w-3 sm:h-3 [@media(min-width:2500px)]:w-4 [@media(min-width:2500px)]:h-4 [@media(min-width:3500px)]:w-5 [@media(min-width:3500px)]:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm sm:text-base [@media(min-width:2500px)]:text-lg [@media(min-width:3500px)]:text-xl" style={{ color: course.textColor || "#1F2937" }}>
                          <span className="font-semibold">{normalizedLocale === "az" ? "Müddət:" : "Длительность:"}</span> {course.duration} {normalizedLocale === "az" ? "ay" : "месяцев"}
                        </span>
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <div className="mt-6 sm:mt-8 lg:mt-10 [@media(min-width:2500px)]:mt-12 [@media(min-width:3500px)]:mt-16 relative -mx-4 sm:-mx-5 lg:-mx-6 [@media(min-width:2500px)]:-mx-8 [@media(min-width:3500px)]:-mx-10 px-4 sm:px-5 lg:px-6 [@media(min-width:2500px)]:px-8 [@media(min-width:3500px)]:px-10 overflow-hidden">
                        <div className="scrolling-tags flex gap-1 sm:gap-2 [@media(min-width:2500px)]:gap-3 [@media(min-width:3500px)]:gap-4 w-max">
                          {tags.map((tag, i) => (
                            <span
                              key={i}
                              className="
                                text-xs sm:text-sm [@media(min-width:2500px)]:text-base [@media(min-width:3500px)]:text-lg bg-white
                                px-2 sm:px-3 [@media(min-width:2500px)]:px-4 [@media(min-width:3500px)]:px-5
                                py-1 sm:py-1.5 [@media(min-width:2500px)]:py-2 [@media(min-width:3500px)]:py-3
                                rounded-full
                                shadow-sm font-medium
                                whitespace-nowrap flex-shrink-0
                              "
                              style={{ 
                                color: course.textColor || "#1F2937",
                                backgroundColor: "rgba(255, 255, 255, 0.9)"
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.map((tag, i) => (
                            <span
                              key={`dup-${i}`}
                              className="
                                text-xs sm:text-sm [@media(min-width:2500px)]:text-base [@media(min-width:3500px)]:text-lg bg-white
                                px-2 sm:px-3 [@media(min-width:2500px)]:px-4 [@media(min-width:3500px)]:px-5
                                py-1 sm:py-1.5 [@media(min-width:2500px)]:py-2 [@media(min-width:3500px)]:py-3
                                rounded-full
                                shadow-sm font-medium
                                whitespace-nowrap flex-shrink-0
                              "
                              style={{ 
                                color: course.textColor || "#1F2937",
                                backgroundColor: "rgba(255, 255, 255, 0.9)"
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 right-0 z-40">
                    <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[230px] md:h-[230px] [@media(min-width:2500px)]:w-[280px] [@media(min-width:2500px)]:h-[280px] [@media(min-width:3500px)]:w-[340px] [@media(min-width:3500px)]:h-[340px]">
                      <Image
                        src={getImageUrl(course.imageUrl)}
                        alt={course.title[normalizedLocale]}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 230px, (min-width: 2500px) 280px, (min-width: 3500px) 340px, 230px"
                        priority={false}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 [@media(min-width:2500px)]:gap-10 [@media(min-width:3500px)]:gap-12 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[300px] sm:h-[320px] md:h-[340px] [@media(min-width:2500px)]:h-[400px] [@media(min-width:3500px)]:h-[480px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gray-100"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesSlider;