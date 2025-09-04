
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
        title: "Not Found",
        description: "The requested course was not found",
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetschool.az";
    const canonicalUrl =
      locale === "az"
        ? `${baseUrl}/course/${params.slug}`
        : `${baseUrl}/${locale}/course/${params.slug}`;

    const azSlug = data.slug?.az || params.slug;
    const ruSlug = data.slug?.ru || params.slug;

    return {
      title: data.title[locale],
      description: data.description[locale],
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
        title: data.title[locale],
        description: data.description[locale],
        url: canonicalUrl,
        type: "website",
        locale: locale === "az" ? "az_AZ" : "ru_RU",
        alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title[locale],
        description: data.description[locale],
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
      title: "Error",
      description: "Failed to load course details",
      robots: {
        index: false,
      },
    };
  }
}

export const revalidate = 60;
