"use client";

import Link from "next/link";
import { FaClock, FaGraduationCap } from "react-icons/fa";
import { getIcon } from "@/utils/icon";
import { Course } from "@/types/course";
import { Locale } from "@/i18n/request";

interface CourseCardProps {
  course: Course;
  locale: Locale;
}

export default function CourseCard({ course, locale }: CourseCardProps) {
  const IconComponent = getIcon(course.icon);

  const formatDuration = (duration: number, locale: Locale) => {
    if (locale === "az") {
      return `${duration} ay`;
    } else {
      return `${duration} ${duration === 1 ? "месяц" : "месяцев"}`;
    }
  };

  const getLevelLabel = () => {
    return (
      <div className="inline-flex items-center gap-2 bg-white border border-jsyellow/20 px-4 py-2 rounded-full">
        <FaGraduationCap className="w-4 h-4 text-jsyellow [@media(min-width:3500px)]:w-[30px] [@media(min-width:3500px)]:h-[30px]" />
        <span className="text-sm font-medium text-jsblack [@media(min-width:3500px)]:text-xl">
          {course.level[locale]}
        </span>
      </div>
    );
  };

  // newTags için güvenli erişim
  const tags = course.newTags?.[locale] || [];

  return (
    <Link
      href={`/${locale}/course/${course.slug[locale]}`}
      className="relative flex  flex-col h-full w-full   md:w-full [@media(min-width:1440px)]:!w-[49%] [@media(min-width:2500px)]:!w-[24%]  bg-[#fef9e7]  border-1 border-jsyellow rounded-[32px] overflow-hidden 
        transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[rgba(252,174,30,0.2)]  hover:scale-[1.02]"
    >
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-jsyellow/10 to-transparent" />

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex justify-end">
          <div className="flex justify-end mb-4 border border-black rounded-3xl ">{getLevelLabel()} </div>
        </div>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-jsyellow border border-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-jsyellow/20">
            <IconComponent className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold [@media(min-width:3500px)]:text-3xl text-jsblack leading-tight">
            {course.title[locale]}
          </h2>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1.5 [@media(min-width:3500px)]:text-xl  bg-jsyellow/10 text-black border-black border text-xs font-medium 
                  rounded-full  border-jsyellow/20 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="flex justify-center items-center px-3 py-1.5 border border-black font-bold bg-gray-100 text-gray-500 text-xs  rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-jsyellow/20 mt-auto">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-jsyellow/10 rounded-full flex items-center justify-center">
              <FaClock className="w-4 h-4 [@media(min-width:3500px)]:w-[30px] [@media(min-width:3500px)]:h-[30px] text-jsyellow" />
            </div>
            <div>
              <span className="text-sm [@media(min-width:3500px)]:text-xl text-gray-500">
                {locale === "az" ? "Müddət" : "Длительность"}
              </span>
              <p className="font-medium [@media(min-width:3500px)]:text-xl">
                {formatDuration(course.duration, locale)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}