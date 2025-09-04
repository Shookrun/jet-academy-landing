import PostFilters from "@/components/views/landing/post/filters";
import PostGrid from "@/components/views/landing/post/grid";
import { Locale } from "@/i18n/request";
import { PostType } from "@/types/enums";
import { getAllPosts } from "@/utils/api/post";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PostsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: PostType;
  };
  params: {
    locale: string;
    type?: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: PostsPageProps): Promise<Metadata> {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "postsPage" });
  const type = params.type?.toUpperCase() as PostType | undefined;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetschool.az";

  const basePath =
    locale === "az"
      ? `/${params.type || "news"}`
      : `/${locale}/${params.type || "news"}`;

  const canonicalUrl = `${baseUrl}${basePath}`;

  let title = t("metaTitle") || "Bloq | JET School";
  let description =
    t("metaDescription") ||
    "JET School-un ən son məqalələrini, xəbərlərini və tədbirlərini kəşf edin";

  if (type) {
    switch (type) {
      case PostType.BLOG:
        title = t("blogMetaTitle") || "Bloq Məqalələri | JET School";
        description =
          t("blogMetaDescription") ||
          "Ən son bloq məqalələrimizi və fikirlərimizi oxuyun";
        break;
      case PostType.NEWS:
        title = t("newsMetaTitle") || "Xəbərlər | JET School";
        description =
          t("newsMetaDescription") ||
          "JET School-un ən son xəbərləri ilə tanış olun";
        break;
      case PostType.EVENT:
        title = t("eventMetaTitle") || "Tədbirlər | JET School";
        description =
          t("eventMetaDescription") ||
          "JET School-da keçirilən və gələcək tədbirləri kəşf edin";
        break;
    }
  }

  const pathWithoutLocale = `/${params.type || "news"}`;
  const azPath =
    locale === "az" ? pathWithoutLocale : `/az${pathWithoutLocale}`;
  const ruPath = `/ru${pathWithoutLocale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}${azPath}`,
        ru: `${baseUrl}${ruPath}`,
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
  searchParams,
  params,
}: PostsPageProps) {
  const locale = params.locale as Locale;
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 9;
  const type = params.type?.toUpperCase() as PostType | undefined;

  const [postsData, t] = await Promise.all([
    getAllPosts({
      page,
      limit,
      postType: type,
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

      <PostFilters type={type} t={t} />

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
