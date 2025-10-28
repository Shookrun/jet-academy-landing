"use client";

import { useEffect, useState } from "react";
import { Locale } from "@/i18n/request";
import { Course, CourseResponse } from "@/types/course";
import Link from "next/link";
import Image from "next/image";

interface ICoursesSlider {
  courses: CourseResponse;
  locale?: Locale;
}

const CourseListingClient = ({ courses, locale = "az" }: ICoursesSlider) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayCourses = courses.items;
  if (!displayCourses) return null;

  const normalizedLocale = locale.slice(0, 2) as "az" | "ru";

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/default-course-image.jpg";
    if (imageUrl.startsWith("https://")) return imageUrl;

    if (imageUrl.startsWith("/uploads")) {
      const cdnUrl =
        process.env.NEXT_PUBLIC_CDN_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api.jetacademy.az";
      return cdnUrl.replace(/\/uploads$/, "") + imageUrl;
    }

    return imageUrl;
  };

  return (
    <div className="container mx-auto my-20 px-0">
      {/* Scroll animasiyası üçün style */}
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

      <div className="relative">
        {isClient ? (
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              gap-6 sm:gap-8 lg:gap-10 py-6
            "
          >
            {displayCourses.map((course: Course) => {
              const cardStyle = {
                backgroundColor: course.backgroundColor || "#FFE082",
                borderColor: course.borderColor || "#F59E0B",
                textColor: course.textColor || "#1A1A1A",
              };

              const title =
                course.title?.[normalizedLocale] || "Untitled Course";
              const slogan =
                course.slogan?.[normalizedLocale] ||
                course.shortDescription?.[normalizedLocale] ||
                (normalizedLocale === "az"
                  ? "Texnologiya dünyasına ilk addımını at!"
                  : "Сделай первый шаг в мир технологий!");
              const tags =
                course.newTags?.[normalizedLocale] ?? course.tag ?? [];
              const level =
                course.level?.[normalizedLocale] ||
                (normalizedLocale === "az" ? "Başlanğıc" : "Начальный");
              const age = course.ageRange || "9-15";
              const duration = course.duration || "6";

              return (
                <Link
                  key={course.id}
                  href={`/${normalizedLocale}/course/${course.slug[normalizedLocale]}`}
                  className="
                    relative flex flex-col justify-between
                    rounded-2xl overflow-hidden
                    p-8 sm:p-10
                    min-h-[320px] sm:min-h-[340px]
                    transition-all duration-300
                    hover:scale-[1.03] hover:shadow-xl
                    cursor-pointer
                  "
                  style={{
                    backgroundColor: cardStyle.backgroundColor,
                    color: cardStyle.textColor,
                    border: `2px solid ${cardStyle.borderColor}`,
                  }}
                >
                  {/* Başlıq və slogan */}
                  <div className="z-10">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 leading-tight text-gray-900">
                      {title}
                    </h2>
                    <p className="text-base sm:text-lg opacity-80 font-medium">
                      {slogan}
                    </p>
                  </div>

                  {/* Əlavə məlumatlar */}
                  <div className="flex flex-col gap-1 text-sm sm:text-base mt-5 opacity-90">
                    <p>
                      <span className="font-semibold">
                        {normalizedLocale === "az" ? "Yaş:" : "Возраст:"}
                      </span>{" "}
                      {age}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {normalizedLocale === "az" ? "Səviyyə:" : "Уровень:"}
                      </span>{" "}
                      {level}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {normalizedLocale === "az"
                          ? "Müddət:"
                          : "Длительность:"}
                      </span>{" "}
                      {duration} {normalizedLocale === "az" ? "ay" : "мес."}
                    </p>
                  </div>

                  {/* Slider kimi tag-lar */}
                  {tags.length > 0 && (
                    <div className="relative overflow-hidden mt-6 -mx-8 px-8">
                      <div className="scrolling-tags flex gap-2 w-max">
                        {[...tags, ...tags].map((tag, i) => (
                          <span
                            key={i}
                            className="
                              text-xs sm:text-sm px-3 py-1
                              bg-white bg-opacity-80
                              rounded-full font-medium
                              shadow-sm whitespace-nowrap
                            "
                            style={{
                              color: cardStyle.textColor,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Şəkil */}
                  <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] drop-shadow-lg">
                    <Image
                      src={getImageUrl(course.imageUrl)}
                      alt={title}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                      sizes="150px"
                    />
                  </div>

                  {/* Dekorativ dairə */}
                  <div
                    className="absolute w-[160px] h-[160px] rounded-full opacity-30 -bottom-10 -right-10 blur-2xl"
                    style={{ backgroundColor: cardStyle.borderColor }}
                  ></div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[340px] rounded-[32px] bg-gray-100"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListingClient;
