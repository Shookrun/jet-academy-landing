import SectionTitle from "@/components/shared/section-title";
import { TeamMember } from "@/types/team";
import { getLocale } from "next-intl/server";
import TeamMemberCard from "./team-member-card";
import { Locale } from "@/i18n/request";
import SectionTitleSingle from "@/components/shared/section-title-single";

interface TeamSectionProps {
  title: string;
  description: string;
  teamMembers: TeamMember[];
}
export default async function TeamSection({
  title,
  description,
  teamMembers,
}: TeamSectionProps)

{
  const locale = (await getLocale()) as Locale;
  return (
    <section className="container">
      <SectionTitleSingle title={title} description={description} />


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 [@media(min-width:2500px)]:grid-cols-8 gap-6 mt-12">
        {teamMembers?.map((teamMember: TeamMember, index) => (
          <TeamMemberCard
            key={teamMember.fullName}
            member={teamMember}
            index={index}
            locale={locale}
          />
        ))}
        
      </div>
    </section>
  );
}