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

const CoursesSlider = ({ courses, locale = "az" }: ICoursesSlider) => {
  const t = useTranslations("courseInfoCP");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const displayCourses = courses.items;
  if (!displayCourses) return null;

  const normalizedLocale = locale.slice(0, 2) as "az" | "ru";

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/default-course-image.jpg"; 
    
    if (imageUrl.startsWith("http://api.new.jetacademy.az")) {
      const httpsUrl = imageUrl.replace("http://", "https://");
     
      return httpsUrl;
    }
    
    if (imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith("/uploads")) {
      const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://api.new.jetacademy.az/uploads";
      return cdnUrl.replace("/uploads", "") + imageUrl;
    }
    
    return imageUrl;
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title={t("title")} />

      <div className="relative">
        {isClient ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640:{
                slidesPerView:2,
              },
              1200:{
                slidesPerView:3,
              },
              1400:{
                slidesPerView:4
              }
            }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            className="swiper-courses py-8 px-2"
            style={{
              overflow: 'visible',
              paddingLeft: '8px',
              paddingRight: '8px'
            }}
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
                <SwiperSlide key={course.id} className="h-full" style={{ overflow: 'visible' }}>
                  <Link
                    key={course.id}
                    href={`/${normalizedLocale}/course/${course.slug[normalizedLocale]}`}
                    className="
                      relative flex flex-col
                      w-full border-2 
                      rounded-[32px] overflow-hidden
                      p-6 min-h-[460px]
                      [@media(min-width:3500px)]:min-h-[450px]
                      transition-all duration-300 hover:shadow-lg hover:shadow-black/20
                      group
                      transform hover:scale-[1.02] hover:z-10
                    "
                    style={{
                      backgroundColor: cardStyle.backgroundColor,
                      borderColor: cardStyle.borderColor,
                      color: cardStyle.color,
                    }}
                  >

                    <div 
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-60" 
                      style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                    />
                    
                    <div className="relative z-20 flex flex-col gap-3 pb-4">
                    
                      <div>
                        <h2 className="text-2xl font-bold [@media(min-width:3500px)]:text-4xl leading-tight mb-1" style={{ color: course.borderColor || "#F59E0B" }}>
                          {course.title[normalizedLocale]}
                        </h2>
                        <p className="text-base [@media(min-width:3500px)]:text-2xl" style={{ color: course.textColor || "#1F2937" }}>
                          {shortDesc}
                        </p>
                      </div>

                      <div className="space-y-2 mt-3">
                        {course.ageRange && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                            >
                              <svg className="w-3 h-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-base [@media(min-width:3500px)]:text-2xl" style={{ color: course.textColor || "#1F2937" }}>
                              <span className="font-semibold [@media(min-width:3500px)]:text-2xl">{normalizedLocale === "az" ? "Yaş:" : "Возраст:"}</span> {course.ageRange}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                          >
                            <svg className="w-3 h-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-base [@media(min-width:3500px)]:text-2xl" style={{ color: course.textColor || "#1F2937" }}>
                            <span className="font-semibold ">{normalizedLocale === "az" ? "Səviyyə:" : "Уровень:"}</span> {course.level[normalizedLocale]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 [@media(min-width:3500px)]:w-7  [@media(min-width:3500px)]:h-7 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: course.borderColor || "#F59E0B" }}
                          >
                            <svg className="w-3 [@media(min-width:3500px)]:w-4  [@media(min-width:3500px)]:h-4 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-base [@media(min-width:3500px)]:text-2xl" style={{ color: course.textColor || "#1F2937" }}>
                            <span className="font-semibold">{normalizedLocale === "az" ? "Müddət:" : "Длительность:"}</span> {course.duration} {normalizedLocale === "az" ? "ay" : "месяцев"}
                          </span>
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="
                                text-sm bg-white
                                px-3 py-1.5 rounded-full
                                shadow-sm font-medium
                                [@media(min-width:3500px)]:text-xl
                              "
                              style={{ 
                                color: course.textColor || "#1F2937",
                                backgroundColor: "rgba(255, 255, 255, 0.9)"
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
                              +{tags.length - 4} {normalizedLocale === "az" ? "daha" : "еще"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-0 right-0 z-40">
                      <div className="relative w-[180px] h-[180px]">
                        <Image
                          src={getImageUrl(course.imageUrl)}
                          alt={course.title[normalizedLocale]}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                          sizes="180px"
                          priority={false}
                        />
                      </div>
                    </div>
                  </Link>
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