import SectionTitle from "@/components/shared/section-title";
import React from "react";
import CourseModules from "./course-modules";
import { getTranslations } from "next-intl/server";

async function Technologies() {
  const t = await getTranslations("courseInfo");
  return (
    <div id="courses" className="container my-20 flex flex-col gap-8">
      <SectionTitle title={t("title")} description={t("description")} />
      <CourseModules />
    </div>
  );
}

export default Technologies;
