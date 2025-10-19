import React from "react";
import CourseContent from "./course-content";
import { Locale } from "@/i18n/request";
import { getTranslations } from "next-intl/server";

interface CourseHeroProps {
  title: string;
  description: string;
  courseOverviewText: string;
  tags?: string[];
  locale: Locale;
  data: any;
  params: {
    slug: string;
    locale: string;
  };
}

export default async function CourseHero({
  title,
  description,
  courseOverviewText,
  tags = [],
  locale,
  data,
}: CourseHeroProps) {
  const t = await getTranslations("singleCoursePage");

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6 animate-fadeIn [@media(min-width:3500px)]:!text-5xl">

      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold leading-snug text-jsblack [@media(min-width:3500px)]:!text-5xl">
        {title}
      </h1>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm [@media(min-width:3500px)]:!text-2xl"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 w-full [@media(min-width:3500px)]:!text-5xl">

        <div
          className="relative bg-[#fef7eb] border border-jsyellow rounded-xl sm:rounded-2xl lg:rounded-[32px] 
                     p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg w-full 
                     [@media(min-width:3500px)]:!text-2xl xl:text-2xl bg-cover bg-center bg-no-repeat min-h-[200px]"
          style={{
            backgroundImage: data?.imageUrl ? `url("${data.imageUrl}")` : 'linear-gradient(135deg, #fef7eb 0%, #f7e6c4 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-white/85 rounded-xl sm:rounded-2xl lg:rounded-[32px]" />

          <div className="relative z-10">
            <p className="font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl 
                           [@media(min-width:3500px)]:!text-3xl mb-2 sm:mb-3 lg:mb-4">
              {courseOverviewText}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              className="text-black prose prose-xs sm:prose-sm lg:prose-base max-w-none 
                         [@media(min-width:3500px)]:!text-3xl"
            />
          </div>
        </div>

        <div className="w-full">
          <CourseContent
  title={t("courseModules")}
  locale={(locale.slice(0,2) === "en" ? "en" : "az")}
  modules={data.modules}
/>
        </div>
      </div>
    </div>
  );
}