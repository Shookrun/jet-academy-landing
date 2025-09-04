import PostFilters from "@/components/views/landing/post/filters";
import PostGrid from "@/components/views/landing/post/grid";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import { getAllPosts } from "@/utils/api/post";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface BlogPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    type?: PostType;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "blogPage" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetschool.az";

  let canonicalUrl =
    locale === "az" ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog`;

  const page = searchParams.page;
  if (page && page !== "1") {
    canonicalUrl += `?page=${page}`;
  }

  const isIndexable = !searchParams.page || searchParams.page === "1";

  const title = t("metaTitle") || "Bloq | JET School";
  const description =
    t("metaDescription") || "JET School-un ən son bloq məqalələrini kəşf edin";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: locale === "az" ? `${baseUrl}/blog` : `${baseUrl}/az/blog`,
        ru: `${baseUrl}/ru/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function BlogPage({
  searchParams,
  params,
}: BlogPageProps) {
  const locale = params.locale as Locale;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const type = PostType.BLOG;

  const [postsData, t] = await Promise.all([
    getAllPosts({
      page,
      limit,
      postType: type,
    }),
    getTranslations({ locale, namespace: "blogPage" }),
  ]);

  const { items: posts, meta } = postsData;

  const transformedMeta = {
    page: meta.page,
    limit: meta.limit,
    totalItems: meta.total,
    totalPages: meta.totalPages,
  };

  return (
    <div className="container py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pageTitle")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("pageDescription")}
        </p>
      </div>
      <PostFilters type={type} t={t} />

      <PostGrid posts={posts} locale={locale} t={t} meta={transformedMeta} />
    </div>
  );
}
