// app/[locale]/courses/page.tsx
import CourseListingClient from "@/components/views/landing/courses/course-listing-client";
import { Locale } from "@/i18n/request";
import { CourseResponse } from "@/types/course";
import { getAllCourses } from "@/utils/api/course";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("coursesPage");
  const locale = (await getLocale()) as Locale;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";
  const canonicalUrl = locale === "az" 
    ? `${baseUrl}/courses` 
    : `${baseUrl}/${locale}/courses`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}/courses`,
        ru: `${baseUrl}/ru/courses`,
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default async function CoursesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("coursesPage");
  const courses: CourseResponse = await getAllCourses({
    limit : 24, 
    page : 1
  });

  return (
    <main className="min-h-screen [@media(min-width:2500px)]:min-h-full  py-16">
      <div className="container mx-auto px-10">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold [@media(min-width:2500px)]:!text-5xl [@media(min-width:3500px)]:!text-6xl text-jsblack mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 max-w-2xl [@media(min-width:3500px)]:!text-4xl mx-auto [@media(min-width:2500px)]:!text-2xl">
            {t("description")}
          </p>
        </div>
        
        <CourseListingClient 
          courses={courses} 
          locale={locale} 
          
        />
       
      </div>
    </main>
  );
}