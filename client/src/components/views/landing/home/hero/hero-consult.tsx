"use client";
import Button from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { HiArrowSmRight } from "react-icons/hi";

export default function HeroConsult() {
  const t = useTranslations("hero");
  return (
    <Link href={"/courses"}>
    <Button
      variant="primary"
      className="shadow-jsshadow hover:bg-[white] hover:text-jsyellow text-white  [@media(min-width:3500px)]:!text-2xl mx-auto md:mx-0"
      text={t("getConsult")}
      iconPosition="right"
      icon={<HiArrowSmRight size={22} className="[@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />}
    />
    </Link>
  );
}
