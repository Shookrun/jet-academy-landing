import PostFilters from "@/components/views/landing/post/filters";
import PostGrid from "@/components/views/landing/post/grid";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import { getAllPosts } from "@/utils/api/post";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PostsPageProps {
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
}: PostsPageProps): Promise<Metadata> {
  const locale = params.locale;
  const type = searchParams.type as PostType | undefined;
  const t = await getTranslations({ locale, namespace: "postsPage" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  const basePath = locale === "az" ? "/news" : `/${locale}/news`;

  let canonicalUrl = `${baseUrl}${basePath}`;
  if (type) {
    canonicalUrl = `${baseUrl}${basePath}?type=${type}`;
  }

  let title = t("metaTitle") || "Bloq | JET Academy";
  let description =
    t("metaDescription") ||
    "JET Academy-nin ən son məqalələrini, xəbərlərini və tədbirlərini kəşf edin";

  if (type) {
    switch (type) {
      case PostType.BLOG:
        title = t("blogMetaTitle") || "Bloq Məqalələri | JET Academy";
        description =
          t("blogMetaDescription") ||
          "Ən son bloq məqalələrimizi və fikirlərimizi oxuyun";
        break;
      case PostType.NEWS:
        title = t("newsMetaTitle") || "Xəbərlər | JET Academy";
        description =
          t("newsMetaDescription") ||
          "JET Academy-un ən son xəbərləri ilə tanış olun";
        break;
      case PostType.EVENT:
        title = t("eventMetaTitle") || "Tədbirlər | JET Academy";
        description =
          t("eventMetaDescription") ||
          "JET Academy-da keçirilən və gələcək tədbirləri kəşf edin";
        break;
    }
  }

  const queryParam = type ? `?type=${type}` : "";
  const azPath =
    locale === "az" ? `/news${queryParam}` : `/az/news${queryParam}`;
  const enPath = `/en/news${queryParam}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}${azPath}`,
        en: `${baseUrl}${enPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "en_US",
      alternateLocale: locale === "az" ? "en_US" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: !searchParams.page && !searchParams.limit,
      follow: true,
      googleBot: {
        index: !searchParams.page && !searchParams.limit,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}
export default async function AllPostsPage({
  params,
  searchParams,
}: PostsPageProps) {
  const locale = params.locale as Locale;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 9;
  const type = searchParams.type as PostType | undefined;

  const [postsData, t] = await Promise.all([
    getAllPosts({
      page,
      limit,
      postType: type,
      includeBlogs: true,
    }),
    getTranslations({ locale, namespace: "postsPage" }),
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

      {/* Post Type Filter */}
      <PostFilters type={type} t={t} />

      {/* Posts Grid */}
      <PostGrid
        posts={posts}
        locale={locale}
        t={t}
        meta={transformedMeta}
        type={type}
      />
    </div>
  );
}
