"use client";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useBreadcrumbTitle } from "@/hooks/BreadcrumbTitleContext";
import { useEffect, useState } from "react";

interface BreadcrumbsProps {
  dynamicTitle?: string;
}

export default function Breadcrumbs({
  dynamicTitle: propDynamicTitle,
}: BreadcrumbsProps) {
  const { dynamicTitle: contextDynamicTitle } = useBreadcrumbTitle();
  const finalDynamicTitle = propDynamicTitle ?? contextDynamicTitle ?? null;

  const fullPathname = usePathname(); 
  const locale = useLocale(); 

  const [singleTitle, setSingleTitle] = useState<string | null>(null);

  const pathname = fullPathname.replace(`/${locale}`, '') || '/'; 
  const segments = pathname.split("/").filter(Boolean);
  
  const isSinglePage = segments.length === 2;
  const lastIndex = segments.length - 1;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetschool.az";

  useEffect(() => {
    if (isSinglePage && !finalDynamicTitle && segments[lastIndex]) {
      const slug = segments[lastIndex];
      const parentSegment = segments[0]; 
      
      let apiEndpoint = '';
      

      if (parentSegment === 'course') {
        apiEndpoint = `${baseUrl}/api/course/${slug}`;
      } else if (parentSegment === 'news') {
        apiEndpoint = `${baseUrl}/api/news/${slug}`;
      } else {

        return;
      }
      
      fetch(apiEndpoint)
        .then((res) => {
          if (!res.ok) throw new Error(`${parentSegment} not found`);
          return res.json();
        })
        .then((data) => {
          console.log(`${parentSegment} API Response:`, data); 
          const title = data?.title?.[locale] || data?.title?.az || data?.title || null;
          console.log(`Selected ${parentSegment} title:`, title); 
          setSingleTitle(title);
        })
        .catch((error) => {
          console.error(`${parentSegment} API Error:`, error);
          setSingleTitle(null);
        });
    }
  }, [isSinglePage, finalDynamicTitle, segments, lastIndex, locale, baseUrl]);

  if (segments.length === 0) return null;

  const translations: Record<string, Record<string, string>> = {
    az: {
      home: "Ana Səhifə",
      courses: "Kurslar",
      course: "Kurs", 
      "about-us": "Haqqımızda",
      offers: "Təkliflər",
      contact: "Əlaqə",
      gallery: "Qalereya",
      glossary: "Lüğət",
      term: "Termin",
      category: "Kateqoriya",
      search: "Axtarış",
      blog: "Blog",
      news: "Xəbərlər",
      terms: "Terminlər",
      projects: "Layihələr",
      "contact-us": "Bizimlə əlaqə"
    },
    ru: {
      home: "Главная",
      courses: "Курсы", 
      course: "Курс",
      "about-us": "О нас",
      contact: "Контакты",
      gallery: "Галерея",
      glossary: "Глоссарий",
      term: "Термин",
      category: "Категория", 
      search: "Поиск",
      blog: "Блог",
      news: "Новости",
      terms: "Термины",
      offers: "Предложения",
      projects: "Проекты",
      "contact-us": "Связаться с нами"
    }
  };

  const capitalizeFirstWord = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const getSegmentLabel = (segment: string, index: number): string => {
    if (isSinglePage && index === lastIndex && (finalDynamicTitle || singleTitle)) {
      return finalDynamicTitle ?? singleTitle ?? "";
    }

    const currentLang = locale as 'az' | 'ru';
    const translation = translations[currentLang]?.[segment.toLowerCase()];
    
    if (translation) {
      return translation;
    }
    const cleanedSegment = decodeURIComponent(segment).replace(/-/g, " ");
    return capitalizeFirstWord(cleanedSegment);
  };

  return (
    <nav className="p-2 text-sm text-gray-700 flex gap-1 items-center flex-wrap">
      <Link
        href="/"
        className="hover:text-jsyellow transition-colors [@media(min-width:3500px)]:text-2xl"
      >
        {translations[locale as 'az' | 'ru']?.home || "Home"}
      </Link>
      
      {segments.map((segment, index) => {
        if (!segment) return null;

        const href = `/${locale}` + "/" + segments.slice(0, index + 1).join("/");
        const label = getSegmentLabel(segment, index);

        return (
          <span key={`${href}-${index}`} className="flex items-center gap-1">
            <span className="text-gray-400 [@media(min-width:3500px)]:text-2xl">&gt;</span>
            {index === lastIndex ? (
              <span className="font-semibold text-jsblack [@media(min-width:3500px)]:text-2xl">
                {label}
              </span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-jsyellow transition-colors [@media(min-width:3500px)]:text-2xl"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}