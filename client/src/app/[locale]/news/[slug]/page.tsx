import PostHero from "@/components/views/landing/post/hero";
import RelatedPosts from "@/components/views/landing/post/related";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import { getAllPosts, getPostDetails } from "@/utils/api/post";
import { formatDateTime } from "@/utils/formatters/formatDate";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ContactFormForBlog from "@/components/views/landing/contact-us/contact-form-for-blog";

interface ISinglePostPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateStaticParams() {
  try {
    const { items } = await getAllPosts({ page: 1, limit: 1000 });
    const locales: Locale[] = ["az", "ru"];



    return locales.flatMap((locale) =>
      items
        .filter((item) => item.slug && item.slug[locale])
        .map((item) => ({
          locale,
          slug: item.slug[locale]!,
        }))
    );
  } catch (error) {
    console.error("Error generating static paths for posts:", error);
    return [];
  }
}

export default async function SinglePostPage({ params }: ISinglePostPageProps) {
  try {
    const [data, locale, t] = await Promise.all([
      getPostDetails(params.slug),
      getLocale() as Promise<Locale>,
      getTranslations("singlePostPage"),
    ]);


    if (!data || !data.title[locale] || !data.content[locale]) {
      console.warn(
        `Post data missing for slug: ${params.slug}, locale: ${locale}`
      );
      notFound();
    }

    const formattedDate = formatDateTime(data.createdAt);
    const isEvent = data.postType === PostType.EVENT;

    const getPostTypeName = (type: PostType) => {
      switch (type) {
        case PostType.BLOG:
          return "blog";
        case PostType.NEWS:
          return "news";
        case PostType.EVENT:
          return "event";
        default:
          return type;
      }
    };

    return (
      <main className="min-h-screen ">
        <div className="relative container">
          <div className="flex flex-col lg:flex-row gap-8 py-20">
            <div className="w-full flex flex-col gap-8 lg:w-2/3">
              <PostHero
                title={data.title[locale]}
                type={t(
                  `postType.${getPostTypeName(data.postType).toLowerCase()}`
                )}
                date={formattedDate}
                eventDate={
                  isEvent && data.eventDate
                    ? formatDateTime(data.eventDate)
                    : undefined
                }
                content={data.content[locale]}
                tags={data.tags || []}
                imageUrl={data.imageUrl}
                dateText={t("dateLabel")}
                eventDateText={t("eventDateLabel")}
                tagsText={t("tagsLabel")}
              />

              <RelatedPosts
                title={t("relatedPosts")}
                locale={locale}
                currentPostId={data.id}
                postType={data.postType}
                tags={data.tags || []}
              />
            </div>

            <div className="w-full lg:w-1/3 lg:sticky lg:top-7 h-fit">
            <ContactFormForBlog/>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in SinglePostPage:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ISinglePostPageProps): Promise<Metadata> {
  try {
    const data = await getPostDetails(params.slug);
    const locale = params.locale as Locale;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

    if (!data || !data.title[locale] || !data.content[locale]) {
      console.warn(
        `Metadata: Post data missing for slug: ${params.slug}, locale: ${locale}`
      );
      return {
        title: "Not Found",
        description: "The requested post was not found",
        robots: {
          index: false,
        },
      };
    }

    const contentText = data.content[locale]
      .replace(/<[^>]*>/g, "")
      .substring(0, 160);

    const postTypeUrl = data.postType === PostType.BLOG ? "blog" : "news";

    const canonicalUrl =
      locale === "az"
        ? `${baseUrl}/${postTypeUrl}/${params.slug}`
        : `${baseUrl}/${locale}/${postTypeUrl}/${params.slug}`;

    const azSlug = data.slug?.az || params.slug;
    const ruSlug = data.slug?.ru || params.slug;

    return {
      title: data.title[locale],
      description: contentText,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          az: data.slug.az ? `${baseUrl}/${postTypeUrl}/${azSlug}` : undefined,
          ru: data.slug.ru
            ? `${baseUrl}/ru/${postTypeUrl}/${ruSlug}`
            : undefined,
        },
      },
      openGraph: {
        title: data.title[locale],
        description: contentText,
        url: canonicalUrl,
        images: data.imageUrl ? [data.imageUrl] : [],
        type: "article",
        locale: locale === "az" ? "az_AZ" : "ru_RU",
        alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title[locale],
        description: contentText,
        images: data.imageUrl ? [data.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Failed to load post details",
      robots: {
        index: false,
      },
    };
  }
}

export const revalidate = 60;
