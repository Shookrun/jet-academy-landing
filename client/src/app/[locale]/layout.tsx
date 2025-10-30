import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import ScrollItems from "@/components/shared/scroll-items";
import ContactModal from "@/components/shared/contact-modal";
import TopCircle from "@/components/shared/top-circle";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import React from "react";
import { Metadata } from "next";
import ProjectModal from "@/components/shared/project-modal";
import Breadcrumbs from "@/components/views/landing/bread-crumbs/bread-crumbs";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";
  const canonicalUrl = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}/az`,
        ru: `${baseUrl}/ru`,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonicalUrl,
      siteName: "JET Academy",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
    },
    authors: [{ name: "JET Academy" }],
    category: "education",
  };
}

export default async function WebsiteLayout({
  params: { locale },
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
    <div className="flex flex-col min-h-screen">
        <ScrollItems />
        <Header />

        <div className="container pt-4">
          <Breadcrumbs />
          
        </div>

        <ContactModal />
        <TopCircle />
        <ProjectModal />


        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
