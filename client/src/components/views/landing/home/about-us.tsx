// src/components/views/landing/home/about-us.tsx
import SectionTitle from "@/components/shared/section-title";
import { getAboutPoints } from "@/data/info";
import { getTranslations } from "next-intl/server";
import React from "react";

async function AboutUs() {
  const t = await getTranslations("about");
  const aboutPoints = getAboutPoints(t);

  return (
    <div
      id="about"
      className="
        container mx-auto
        my-20 4xl:my-24
        flex flex-col
        gap-8 4xl:gap-12
        p-0
      "
    >
      <SectionTitle title={t("title")} description={t("description")} />

      <div className="flex flex-wrap [@media(min-width:2500px)]:!flex-nowrap justify-around  gap-4 4xl:gap-6 relative">
        {aboutPoints.map((point, index) => (
          <div
            key={index}
            className={`
              w-full md:w-[49%] [@media(min-width:2500px)]:w-[25%] border
              
              flex items-start
              gap-3 4xl:gap-6
              bg-white border-jsyellow
              rounded-[32px]
              p-6 4xl:p-8
              text-jsblack
              
            `}
          >
            <div
              className="
                bg-jsyellow text-white font-bold
                flex items-center justify-center
                text-xl 4xl:text-2xl
                rounded-full
                p-4
                h-10 w-10 4xl:h-12 4xl:w-12
                [@media(min-width:3500px)]:!text-2xl
              "
            >
              {index + 1}
            </div>

            <div className="flex flex-col gap-4 4xl:gap-6">
              <h1 className="font-semibold [@media(min-width:3500px)]:!text-3xl text-[28px] 4xl:text-3xl">
                {point.title}
              </h1>
              <p className="text-base 4xl:text-lg [@media(min-width:3500px)]:!text-2xl">{point.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
