
import AboutUs from "@/components/views/landing/home/about-us";
import Blogs from "@/components/views/landing/home/blogs";
import CoursesSlider from "@/components/views/landing/home/courses";
import Gallery from "@/components/views/landing/home/gallery";
import Hero from "@/components/views/landing/home/hero";
import Projects from "@/components/views/landing/home/projects";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/request";

import TeamSectionMap from "@/components/views/landing/team-section";

const getCourses = async (locale: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses?lang=${locale}`,
      { next: { revalidate: 60 } }
    );
    return await res.json();
  } catch {
    console.error("Failed to fetch courses");
    return [];
  }
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "Metadata",
  });
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://jetacademy.az";
  const canonical = `${baseUrl}/${params.locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical,
      languages: {
        az: `${baseUrl}/az`,
        en: `${baseUrl}/en`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonical,
      siteName: "JET Academy",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: t("ogImageAlt") }],
      locale: params.locale === "az" ? "az_AZ" : "en_US",
      alternateLocale: params.locale === "az" ? "en_US" : "az_AZ",
      type: "website",
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    twitter: { card: "summary_large_image", title: t("ogTitle"), description: t("ogDescription"), images: ["/og-image.jpg"] },
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  const courses = await getCourses(params.locale);


  return (
    <main className="bg-background">
      <div
        className="
          container
          mx-auto
          px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
          2xl:px-10 3xl:px-24 4xl:px-32
          relative z-10
        "
      >
        <Hero />
        <CoursesSlider courses={courses} locale={params.locale as Locale} />
        <AboutUs />
       <TeamSectionMap/>
        <Projects />
        <Gallery />
        <Blogs />
      </div>
    </main>
  );
}
