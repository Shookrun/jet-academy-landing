import { CourseEligibility } from "@/types/course";
import { getIcon } from "@/utils/icon";

interface IEligibilitySectionProps {
  eligibility: CourseEligibility[];
  title: string;
  locale: "az" | "en";
}

export default function EligibilitySection({
  eligibility,
  title,
  locale,
}: IEligibilitySectionProps) {
  return (
    <div className="mt-20 pt-10">
      <h2 className="text-2xl [@media(min-width:3500px)]:!text-5xl  font-semibold mt-12 mb-6 text-center lg:text-left">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {eligibility.map((criteria, index) => {
          const IconComponent = getIcon(criteria.eligibility.icon);

          return (
            <div
              key={index}
              className="bg-[#fef7eb] border border-jsyellow rounded-[32px] p-6 
                transition-all duration-300 ease-in-out hover:scale-[1.02] 
                hover:shadow-lg hover:shadow-[rgba(252,174,30,0.15)]"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-jsyellow text-white p-4 rounded-full">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold [@media(min-width:3500px)]:!text-3xl text-xl">
                  {criteria.eligibility.title[locale]}
                </h3>
                <p className="text-gray-600 [@media(min-width:3500px)]:!text-2xl">
                  {criteria.eligibility.description[locale]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
