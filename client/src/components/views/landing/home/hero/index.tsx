// src/components/views/landing/home/hero.tsx
import Button from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { FaCompass } from "react-icons/fa6";
import HeroConsult from "./hero-consult";
import HeroImage from "./image";

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <div
      id="hero"
      className="
        container
    flex flex-col-reverse md:flex-row
    items-center justify-center
    gap-3 2xl:gap-48
    mt-10
    p-0
     lg:px-4
    [@media(min-width:3500px)]:!px-20
      "
    >
      <div
        id="left"
        className="
         w-full flex flex-col gap-8
        "
      >
        <Button
          variant="secondary"
          icon={<FaCompass size={20} color="#FCAE1E" className="[@media(min-width:3500px)]:!w-12 [@media(min-width:3500px)]:!h-12" />}
          text="#yaratmağabaşla"
          className="
            shadow-jsshadow
            mx-auto md:mx-0
            text-sm md:text-base lg:text-lg
            py-2 md:py-3
            px-4 md:px-6
            [@media(min-width:3500px)]:!text-2xl
          "
        />

        <h1
          className="
            font-bold text-jsblack
            text-4xl md:text-3xl lg:text-4xl xl:text-5xl
            leading-tight
            [@media(min-width:3500px)]:!text-6xl
          "
        >
          {t("toJetSchool")}{" "}
          <span className="text-jsyellow [@media(min-width:3500px)]:!text-6xl">{t("welcome")}!</span>
        </h1>

        <p
          className="
            font-medium text-[#A8A8A8]
            whitespace-pre-line leading-7
            text-base md:text-lg lg:text-xl
            [@media(min-width:3500px)]:!text-2xl
          "
        >
          {t("description")}
        </p>

        <HeroConsult />
      </div>

      <div
        className="
          w-full flex justify-center
          
        "
      >
        <HeroImage />
      </div>
    </div>
  );
}
