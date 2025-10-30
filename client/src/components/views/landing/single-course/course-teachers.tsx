"use client";

import SectionTitle from "@/components/shared/section-title";
import { CourseTeacherAsMember } from "@/types/team";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamMemberCard from "../about/team-member-card";

interface TeachersSectionProps {
  data: { teachers: CourseTeacherAsMember[] };
  locale: "az" | "ru";
  title: string;
  description: string;
}

export default function TeachersSection({
  data,
  locale,
  title,
  description,
}: TeachersSectionProps) {
  const activeTeachers =
    data.teachers?.filter((t) => t.teacher?.isActive !== false) ?? [];
  if (activeTeachers.length === 0) return null;

  return (
    <section className="flex flex-col gap-8">
      <SectionTitle title={title} description={description} />

      <Swiper
        modules={[Autoplay]}
        navigation={false}
        speed={800}
        spaceBetween={24}
        autoplay={{ delay: 1800, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 6, spaceBetween: 24 },
          2500: { slidesPerView: 8, spaceBetween: 24 },
        }}
        className="w-full py-10"
      >
        {activeTeachers.map((teacher, index) => (
          <SwiperSlide key={teacher.id} className="!h-auto">
            <div className="h-full [&>*]:h-full">
              <TeamMemberCard member={teacher} locale={locale} noHover index={index} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
