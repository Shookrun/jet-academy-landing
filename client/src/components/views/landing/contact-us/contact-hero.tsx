"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ContactHero() {
  const t = useTranslations("contact.hero");

  return (
    <section className="container text-center max-w-3xl mx-auto ">
      <motion.h1
        className="text-5xl font-bold text-jsblack mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("title")}
      </motion.h1>
      <motion.p
        className="text-gray-600 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t("description")}
      </motion.p>
    </section>
  );
}
