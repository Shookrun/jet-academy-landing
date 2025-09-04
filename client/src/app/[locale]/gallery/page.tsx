import GalleryClient from "@/components/views/landing/gallery/gallery-client";
import { GalleryResponse } from "@/types/gallery";
import api from "@/utils/api/axios";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetschool.az";

  const canonicalUrl =
    locale === "az" ? `${baseUrl}/gallery` : `${baseUrl}/${locale}/gallery`;

  return {
    title: t("galleryPageTitle") || "Qalereya",
    description:
      "JET School-da uşaqlar üçün keçirilən IT və proqramlaşdırma dərslərindən görüntülər",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: locale === "az" ? `${baseUrl}/gallery` : `${baseUrl}/az/gallery`,
        ru: `${baseUrl}/ru/gallery`,
      },
    },
    openGraph: {
      title: t("galleryPageTitle") || "Qalereya | JET School",
      description:
        "JET School-da uşaqlar üçün keçirilən IT və proqramlaşdırma dərslərindən görüntülər",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("galleryPageTitle") || "Qalereya | JET School",
      description:
        "JET School-da uşaqlar üçün keçirilən IT və proqramlaşdırma dərslərindən görüntülər",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}
async function fetchGalleryImages(): Promise<GalleryResponse> {
  try {
    const response = await api.get<GalleryResponse>("/gallery?limit=100");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return {
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
      },
    };
  }
}

export default async function GalleryPage() {
  const initialGallery = await fetchGalleryImages();

  return <GalleryClient slider={false} initialGallery={initialGallery} />;
}
