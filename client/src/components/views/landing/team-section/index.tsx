// app/(whatever)/TeamSectionMap.tsx  — SERVER COMPONENT
import api from "@/utils/api/axios";
import { getTranslations } from "next-intl/server";
import React from "react";
import TeamSection from "../about/team-section"; // bunun Client olması da olar, problem deyil

export default async function TeamSectionMap() {
  const t = await getTranslations("aboutPage"); 

  let teamMembers: any[] = [];
  try {
    const res = await api.get("/team/active?limit=30");
    teamMembers = res.data ?? [];
  } catch (err) {
    console.error("Team fetch failed:", err);
  }

  return (
    <TeamSection
      teamMembers={teamMembers}
      title={t("team.title")}
      description={t("team.description")}
    />
  );
}
