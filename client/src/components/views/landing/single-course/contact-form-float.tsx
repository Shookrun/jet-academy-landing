"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ContactFormForSingle from "../contact-us/contact-form-for-single";

interface ContactFormFloatProps {
  title?: string;
}

export default function ContactFormFloat({ title }: ContactFormFloatProps) {
  const t = useTranslations("singleCoursePage");
  
  return (
    <div className="sticky top-4 lg:top-8">
      <motion.div
        className="bg-white border border-jsyellow rounded-[32px] p-6 lg:p-8 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl lg:text-2xl [@media(min-width:3500px)]:!text-4xl font-semibold text-jsblack mb-6 text-center">
          {t(title ? title : "enroll")}
        </h3>
        <ContactFormForSingle />
      </motion.div>
    </div>
  );
}