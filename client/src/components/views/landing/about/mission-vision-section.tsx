"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface MissionVisionProps {
  sectionTitle: string;
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
}

export default function MissionVisionSection({
  sectionTitle,
  mission,
  vision,
}: MissionVisionProps) {
  return (
    <section className="container grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <motion.div
        className="relative [@media(min-width:3500px)]:h-[800px] h-[400px] rounded-[32px] overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Image
          width={600}
          height={400}
          src="/qiz1x1.jpg"
          quality={100}
          alt="Teachers and students"
          className="w-full h-full object-cover bg-top  rounded-[32px]"
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-jsblack [@media(min-width:3500px)]:!text-7xl">{sectionTitle}</h2>

        <div className="flex flex-col gap-6">
          <div className="border border-jsyellow rounded-[32px] p-6 bg-[#fef7eb]">
            <h3 className="font-semibold text-xl [@media(min-width:3500px)]:!text-5xl text-jsblack mb-3">
              {mission.title}
            </h3>
            <p className="text-gray-600 [@media(min-width:3500px)]:!text-3xl">{mission.description}</p>
          </div>

          <div className="border border-jsyellow rounded-[32px] p-6 bg-[#fef7eb]">
            <h3 className="font-semibold text-xl text-jsblack [@media(min-width:3500px)]:!text-5xl mb-3">
              {vision.title}
            </h3>
            <p className="text-gray-600 [@media(min-width:3500px)]:!text-3xl">{vision.description}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
