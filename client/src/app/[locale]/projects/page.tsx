import SectionTitle from "@/components/shared/section-title";
import ProjectCard from "@/components/views/landing/projects/project-card";
import { Project } from "@/types/student-projects";
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
  const canonicalUrl = `${baseUrl}/${locale}/projects`;

  return {
    title: t("projectsPageTitle") || "Layihələr",
    description:
      t("projectsPageDescription") ||
      "Jet Schoolun tələbə layihələri, tələbələrimizin innovasiya və yaradıcılığı nümayiş etdirir",
    keywords: ["tələbə layihələri", "jet school", "təhsil", "innovasiya"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        az: `${baseUrl}/az/projects`,
        ru: `${baseUrl}/ru/projects`,
      },
    },
    openGraph: {
      title: t("projectsPageTitle") || "Layihələr - Jet School",
      description:
        t("projectsPageDescription") ||
        "Jet Schoolun tələbə layihələri, tələbələrimizin innovasiya və yaradıcılığı nümayiş etdirir",
      type: "website",
      url: canonicalUrl,
      locale: locale === "az" ? "az_AZ" : "ru_RU",
      alternateLocale: locale === "az" ? "ru_RU" : "az_AZ",
    },
    twitter: {
      card: "summary_large_image",
      title: t("projectsPageTitle") || "Layihələr - Jet School",
      description:
        t("projectsPageDescription") ||
        "Jet Schoolun tələbə layihələri, tələbələrimizin innovasiya və yaradıcılığı nümayiş etdirir",
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

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "/default-project-image.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  const base =
    (process.env.NEXT_PUBLIC_CDN_URL || "").replace(/\/$/, "") ||
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (!base) {
    if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad"))
      return imageUrl;
    return `/uploads-acad/projects/${imageUrl}`;
  }
  if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad")) {
    return `${base}${imageUrl}`;
  }
  return `${base}/uploads-acad/projects/${imageUrl}`;
};

const fetchProjects = async () => {
  try {
    const response = await api.get("/student-projects?limit=1000&order=desc");
    return response.data as { items: Project[] };
  } catch {
    return { items: [] as Project[] };
  }
};

export default async function Projects({
  params,
}: {
  params: { locale: string };
}) {
  try {
    const t = await getTranslations({
      locale: params.locale,
      namespace: "projects",
    });
    const projects = await fetchProjects();
    if (!projects) return null;

    return (
      <div id="media" className="container my-20 flex flex-col gap-8">
        <SectionTitle title={t("title")} description={t("description")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [@media(min-width:2500px)]:grid-cols-4">
          {projects.items.map((project: Project) => (
            <ProjectCard
              key={project.id}
              imageUrl={getImageUrl(project.imageUrl)}
              link={project.link}
              title={project.title}
              description={project.description}
              category={project.category}
            />
          ))}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="container my-20 text-center">
        <p>Layihələr yüklənmədi. Bir az sonra yenidən yoxlayın.</p>
      </div>
    );
  }
}

export const revalidate = 60;
