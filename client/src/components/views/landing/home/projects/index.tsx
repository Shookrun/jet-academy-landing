import SectionTitle from "@/components/shared/section-title";
import Button from "@/components/ui/button";
import api from "@/utils/api/axios";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import Slider from "./slider";

const fetchProjects = async () => {
  try {
    const response = await api.get("/student-projects?order=desc"); 
    return response.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return null;
  }
};

export default async function Projects() {
  try {
    const t = await getTranslations("feedbacks");
    const projects = await fetchProjects();
    if (!projects) return null;

    const sorted =
      Array.isArray(projects) ?
        projects.slice() :
      projects.items ?
        { ...projects, items: projects.items.slice() } :
        projects;

    return (
      <div
        id="media"
        className="
          container mx-auto
          my-20 4xl:my-24
          p-0
          flex flex-col
          gap-8 4xl:gap-12
        "
      >
        <SectionTitle
          title={t("title")}
          description={t("description")}
        />

        <div>
          <Slider data={sorted} />
        </div>

        <Link href="/projects">
          <Button
            iconPosition="right"
            className="
              items-center mx-auto
              py-3 4xl:py-4 px-6 4xl:px-8
              [@media(min-width:3500px)]:!text-2xl
            "
            icon={<MdArrowRightAlt size={24} className="[@media(min-width:3500px)]:!w-12 [@media(min-width:3500px)]:!h-12" />}
            text={t("seeAll")}
          />
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Projects component error:", error);
    return null;
  }
}