"use client";
import { GalleryResponse } from "@/types/gallery";
import { motion } from "framer-motion";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import GalleryCard from "../../gallery/gallery-card";

interface SliderProps {
  data: GalleryResponse;
  handleItemClick: (index: number) => void;
}

export default function GallerySlider({ data, handleItemClick }: SliderProps) {
  return (
    <div className="py-4">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        spaceBetween={24}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          992: { slidesPerView: 4 },
        }}
        className="!pb-4"
      >
        {data.items.map((gallery, index) => (
          <SwiperSlide key={gallery.id} className=" rounded-3xl">
            <motion.div
              onClick={() => handleItemClick(index)}
              className="h-full shadow-lg rounded-3xl"
            >
              <GalleryCard
                key={gallery.id}
                imageUrl={gallery.imageUrl}
                title={gallery.title.en}
              />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
