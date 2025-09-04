"use client";

import SectionTitle from "@/components/shared/section-title";
import { CourseTeacherAsMember } from "@/types/team";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamMemberCard from "../about/team-member-card";

interface TeachersSectionProps {
  data: {
    teachers: CourseTeacherAsMember[];
  };
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

  const activeTeachers = data.teachers?.filter(teacher => teacher.teacher?.isActive !== false) || [];

  return (
    <>
      {activeTeachers && activeTeachers.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionTitle title={title} description={description} />
          <Swiper
            modules={[Autoplay]}
            navigation={false}
            speed={800}
            spaceBetween={24}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
               2500: {
                slidesPerView: 8,
                spaceBetween: 24,
              },
             
            }}
            className="w-full py-10  relative"
          >
            {activeTeachers.map(
              (teacher: CourseTeacherAsMember, index: number) => (
                <SwiperSlide key={teacher.id}>
                  <TeamMemberCard
                    member={teacher}
                    index={index}
                    noHover
                    locale={locale}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </section>
      )}
    </>
  );
}