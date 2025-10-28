import ContactHero from "@/components/views/landing/contact-us/contact-hero";
import ContactSection from "@/components/views/landing/contact-us/contact-section";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const contactT = await getTranslations({ locale, namespace: "contact" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";

  const canonicalUrl =
    locale === "az"
      ? `${baseUrl}/contact-us`
      : `${baseUrl}/${locale}/contact-us`;

  return {
    title: t("contactPageTitle") || "Əlaqə Məlumatları",
    description:
      contactT("hero.description") ||
      "Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az:
          locale === "az"
            ? `${baseUrl}/contact-us`
            : `${baseUrl}/az/contact-us`,
        ru: `${baseUrl}/ru/contact-us`,
      },
    },
    openGraph: {
      title: t("contactPageTitle") || "Əlaqə Məlumatları | JET Academy",
      description:
        contactT("hero.description") ||
        "Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin.",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("contactPageTitle") || "Əlaqə Məlumatları | JET Academy",
      description:
        contactT("hero.description") ||
        "Suallarınız və ya təklifləriniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
      },
    },
  };
}

export default function ContactPage() {
  return (
    <main className="flex flex-col gap-12 pt-10 md:gap-12 md:pt-10">
      <ContactHero />
      <ContactSection />
    </main>
  );
}
