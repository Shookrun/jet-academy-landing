"use client";

import Button from "@/components/ui/button";
import { useContactModal } from "@/hooks/useContactModal";
import { useTranslations } from "next-intl";
import React from "react";
import { HiArrowSmRight } from "react-icons/hi";

export default function HeroConsult() {
  const { toggle } = useContactModal();
  const t = useTranslations("hero");
  return (
    <Button
      variant="primary"
      onClick={() => toggle()}
      className="shadow-jsshadow hover:bg-[#00A300] text-white hover:text-white [@media(min-width:3500px)]:!text-2xl mx-auto md:mx-0"
      text={t("getConsult")}
      iconPosition="right"
      icon={<HiArrowSmRight size={22} className="[@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />}
    />
  );
}
