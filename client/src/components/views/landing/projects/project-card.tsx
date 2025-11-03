"use client";

import { useProjectModal } from "@/hooks/useProjectModal";
import { useLocale } from "next-intl";
import Image from "next/image";
import { MdPlayCircle } from "react-icons/md";

interface ProjectCardProps {
  imageUrl: string;
  link: string;
  title: {
    az: string;
    en: string;
  };
  description: {
    az: string;
    en: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export default function ProjectCard({
  imageUrl,
  link,
  title,
  description,
  category,
}: ProjectCardProps) {
  const { toggle } = useProjectModal();
  const handleClick = () => {
    toggle(link);
  };
  const locale = useLocale();

  return (
    <div
      className="relative w-full h-[327px] cursor-pointer overflow-hidden rounded-3xl group"
      onClick={handleClick}
    >
      <div className="relative w-full h-full transition-transform duration-300 md:group-hover:scale-105">
        <Image
          src={imageUrl}
          unoptimized
          alt={locale === "az" ? title.az : title.en}
          fill
          className="object-cover rounded-3xl"
        />
      </div>
      <div className="absolute top-2 right-2 z-[1] bg-jsyellow/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {category.name}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/50 p-4 rounded-full transition-all duration-300 md:group-hover:scale-110 md:group-hover:bg-jsyellow/90">
          <MdPlayCircle className="w-8 h-8 text-white" />
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/90 to-black/70 
                    flex flex-col justify-center px-6 backdrop-blur-sm
                    transition-all duration-300 delay-[50ms]
                    md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
      >
        <h3
          className="text-white font-semibold text-lg mb-2 line-clamp-1
                     transition-all duration-300 delay-100
                     md:translate-y-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          {locale === "az" ? title.az : title.en}
        </h3>
        <p
          className="text-gray-200 text-sm line-clamp-2
                    transition-all duration-300 delay-150
                    md:translate-y-5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          {locale === "az" ? description.az : description.en}
        </p>
      </div>
    </div>
  );
}
