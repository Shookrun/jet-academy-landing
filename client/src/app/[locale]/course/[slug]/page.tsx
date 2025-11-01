
import ContactFormFloat from "@/components/views/landing/single-course/contact-form-float";
import EligibilitySection from "@/components/views/landing/single-course/course-eligibility";
import CourseHero from "@/components/views/landing/single-course/course-hero";
import TeachersSection from "@/components/views/landing/single-course/course-teachers";
import CoursesSlider from "@/components/views/landing/single-course/courses-slider";
import { Locale } from "@/i18n/request";
import { getAllCourses, getCourseDetails } from "@/utils/api/course";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BreadcrumbContextWrapper from "@/hooks/BreadcrumbContextWrapper";



interface ISingleCoursePageProps {
  params: {
    slug: string;
    locale: string;
  };
}


export default async function SingleCoursePage({
  params,
}: ISingleCoursePageProps) {
  try {
    const [data, locale, t, courses] = await Promise.all([
      getCourseDetails(params.slug),
      getLocale() as Promise<Locale>,
      getTranslations("singleCoursePage"),
      getAllCourses({}),
    ]);

    if (!data) notFound();

    const courseTitle = data.title[params.locale];

    return (
   <BreadcrumbContextWrapper title={courseTitle}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 3xl:px-28 4xl:px-32 my-10 md:my-16 lg:my-10 4xl:my-24 [@media(min-width:2500px)]:!px-[111px] [@media(min-width:3500px)]:px-32">
          

          <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12 mb-16">

            <div className="w-full lg:w-2/3">
              <CourseHero
                title={data.title[locale]}
                courseOverviewText={t("courseDescription")}
                tags={data.newTags[locale]}
                description={data.description[locale]}
                params={params}
                data={data}
                locale={locale}
              />
            </div>
            

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
              <ContactFormFloat />
            </div>
          </div>

          {data.eligibility && data.eligibility.length > 0 && (
            <EligibilitySection
              locale={locale}
              title={t("whoIsEligibleToEnroll")}
              eligibility={data.eligibility}
            />
          )}
          
          <TeachersSection
            title={t("teachers")}
            description={t("teachersDescription")}
            data={{ teachers: data.teachers }}
            locale={locale}
          />
          
          <CoursesSlider courses={courses} />
        </div>
      </BreadcrumbContextWrapper>
    );
  } catch (error) {
    console.error("Error in SingleCoursePage:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ISingleCoursePageProps): Promise<Metadata> {
  try {
    const data = await getCourseDetails(params.slug);
    const locale = params.locale as Locale;

    if (!data) {
      return {
        title: { absolute: "Not Found" },
        description: "The requested course was not found",
        robots: { index: false },
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

    const canonicalUrl =
      locale === "az"
        ? `${baseUrl}/course/${params.slug}`
        : `${baseUrl}/${locale}/course/${params.slug}`;

    const azSlug = data.slug?.az || params.slug;
    const ruSlug = data.slug?.ru || params.slug;
    const rawTitle =
      data.title?.[locale] ??
      data.title?.az ??
      data.title?.ru ??
      "Kurs";

    const fullTitle = `${rawTitle} | JET Academy`;

    const rawDesc =
      data.shortDescription?.[locale] ??
      data.slogan?.[locale] ??
      data.description?.[locale] ??
      "";

    const stripTags = (html: string) =>
      html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<\/?[^>]+(>|$)/g, " ");
    
    const decodeEntities = (s: string) =>
      s
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    const normalizeWS = (s: string) => s.replace(/\s+/g, " ").trim();

    const toPlainText = (html: string) => normalizeWS(decodeEntities(stripTags(html)));
    
    const truncate = (s: string, max = 160) => {
      if (s.length <= max) return s;
      const cut = s.slice(0, max);
      const lastSpace = cut.lastIndexOf(" ");
      return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
    };

    const cleanDesc = truncate(toPlainText(rawDesc || ""));
    console.log(cleanDesc)
    return {
      title: { absolute: fullTitle },
      description: cleanDesc,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          az:
            locale === "az"
              ? `${baseUrl}/course/${azSlug}`
              : `${baseUrl}/az/course/${azSlug}`,
          ru: `${baseUrl}/ru/course/${ruSlug}`,
        },
      },

      openGraph: {
        title: fullTitle,
        description: cleanDesc,
        url: canonicalUrl,
        type: "website",
        siteName: "JET Academy",
        locale: locale === "az" ? "az_AZ" : "ru_RU",
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: rawTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: fullTitle,
        description: cleanDesc,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: { absolute: "Error | JET Academy" },
      description: "Failed to load course details",
      robots: { index: false },
    };
  }
}



export const revalidate = 60;
