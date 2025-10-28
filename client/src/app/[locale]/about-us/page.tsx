import IntroSection from "@/components/views/landing/about/intro-section";
import MissionVisionSection from "@/components/views/landing/about/mission-vision-section";
import StatsSection from "@/components/views/landing/about/stats-section";
import TeamSection from "@/components/views/landing/about/team-section";
import api from "@/utils/api/axios";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const aboutT = await getTranslations({ locale, namespace: "aboutPage" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jetacademy.az";
  const canonicalUrl =
    locale === "az" ? `${baseUrl}/about-us` : `${baseUrl}/${locale}/about-us`;

  return {
    title: t("aboutPageTitle") || "Haqqımızda",
    description:
      aboutT("introduction.description1") ||
      "2021-ci ildən etibarən JET Academy olaraq ölkənin texnologiya sahəsində aparıcı tədris mərkəzlərindən biri kimi özümüzü sübut etmişik və yüzlərlə yüksək ixtisaslı, uğurlu IT mütəxəssisi yetişdirmişik.",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: locale === "az" ? `${baseUrl}/about-us` : `${baseUrl}/az/about-us`,
        ru: `${baseUrl}/ru/about-us`,
      },
    },
    openGraph: {
      title: t("aboutPageTitle") || "Haqqımızda | JET Academy",
      description:
        aboutT("introduction.description1") ||
        "2021-ci ildən etibarən JET Academy olaraq ölkənin texnologiya sahəsində aparıcı tədris mərkəzlərindən biri kimi özümüzü sübut etmişik və yüzlərlə yüksək ixtisaslı, uğurlu IT mütəxəssisi yetişdirmişik.",
      url: canonicalUrl,
      type: "website",
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("aboutPageTitle") || "Haqqımızda | JET Academy",
      description:
        aboutT("introduction.description1") ||
        "2021-ci ildən etibarən JET Academy olaraq ölkənin texnologiya sahəsində aparıcı tədris mərkəzlərindən biri kimi özümüzü sübut etmişik və yüzlərlə yüksək ixtisaslı, uğurlu IT mütəxəssisi yetişdirmişik.",
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
}

const getTeamMembers = async () => {
  try {
    return (await api.get("/team/active?limit=30")).data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations({
    locale: params.locale,
    namespace: "aboutPage",
  });
  const teamMembers = await getTeamMembers();

  return (
    <div
      className="
      container flex flex-col p-0 gap-16 4xl:gap-24 py-16 4xl:py-28
      "
    >
      <IntroSection
        title={t("introduction.title")}
        description1={t("introduction.description1")}
        description2={t("introduction.description2")}
        description3={t("introduction.description3")}
      />

      <MissionVisionSection
        sectionTitle={t("mission.sectionTitle")}
        mission={{
          title: t("mission.title"),
          description: t("mission.description"),
        }}
        vision={{
          title: t("vision.title"),
          description: t("vision.description"),
        }}
      />

      <StatsSection
        stats={{
          graduatesLabel: t("stats.graduatesLabel"),
          groupsLabel: t("stats.groupsLabel"),
          studentsLabel: t("stats.studentsLabel"),
          teachingArea:t("stats.teachingArea")
        }}
      />

      <TeamSection
        teamMembers={teamMembers}
        title={t("team.title")}
        description={t("team.description")}
      />
    </div>
  );
}
