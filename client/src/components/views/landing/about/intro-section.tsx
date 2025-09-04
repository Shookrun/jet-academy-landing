"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface IntroSectionProps {
  title: string;
  description1: string;
  description2: string;
}

export default function IntroSection({
  title,
  description1,
  description2,
}: IntroSectionProps) {
  return (
    <section className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-jsblack [@media(min-width:2500px)]:!text-4xl [@media(min-width:3500px)]:!text-6xl">{title}</h2>
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 text-xl [@media(min-width:2500px)]:!text-2xl [@media(min-width:3500px)]:!text-4xl">{description1}</p>
          <p className="text-gray-600 text-xl [@media(min-width:2500px)]:!text-2xl [@media(min-width:3500px)]:!text-4xl">{description2}</p>
        </div>
      </motion.div>
      <motion.div
        className="relative [@media(min-width:3500px)]:h-[800px] h-[400px] rounded-[32px] overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Image
          width={600}
          height={400}
          src="/rasim.png"
          quality={100}
          alt="Students coding"
          className="w-full bg-top object-cover h-full  rounded-[32px]"
          priority
        />
      </motion.div>
    </section>
  );
}
