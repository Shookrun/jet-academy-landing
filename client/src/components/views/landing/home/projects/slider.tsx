"use client";
import ProjectCard from "@/components/views/landing/projects/project-card";
import { ProjectResponse } from "@/types/student-projects";
import { motion } from "framer-motion";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface SliderProps {
  data: ProjectResponse;
}

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "/default-project-image.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;

  const base =
    (process.env.NEXT_PUBLIC_CDN_URL || "").replace(/\/$/, "") ||
    (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

  if (!base) {
    if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad"))
      return imageUrl;
    return `/uploads-acad/projects/${imageUrl}`;
  }

  if (imageUrl.startsWith("/uploads") || imageUrl.startsWith("/uploads-acad")) {
    return `${base}${imageUrl}`;
  }
  return `${base}/uploads-acad/projects/${imageUrl}`;
};

export default function ProjectSlider({ data }: SliderProps) {
  return (
    <div className="py-4 4xl:py-6">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={24}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          2560: { slidesPerView: 4 },
          3540: { slidesPerView: 6 },
        }}
        className="!pb-4"
      >
        {data.items.map((project) => (
          <SwiperSlide
            key={project.id}
            className="!h-[327px] rounded-3xl 4xl:rounded-[48px]"
          >
            <motion.div className="h-full shadow-lg rounded-3xl 4xl:rounded-[48px]">
              <ProjectCard
                key={project.id}
                description={project.description}
                title={project.title}
                imageUrl={getImageUrl(project.imageUrl)}
                link={project.link}
                category={project.category}
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
