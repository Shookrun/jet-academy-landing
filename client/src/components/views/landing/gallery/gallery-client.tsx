// src/components/views/landing/home/gallery-client.tsx
"use client";

import SectionTitle from "@/components/shared/section-title";
import GalleryCard from "@/components/views/landing/gallery/gallery-card";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import GallerySlider from "../home/gallery/slider";
import { cn } from "@/utils/cn";

interface GalleryImage {
  id: string;
  title: { az: string; ru: string };
  imageUrl: string;
  createdAt: string;
}

interface GalleryResponse {
  items: GalleryImage[];
  meta: { total: number; page: number; limit: number };
}

interface GalleryClientProps {
  initialGallery: GalleryResponse;
  slider?: boolean;
}

export default function GalleryClient({
  initialGallery,
  slider = false,
}: GalleryClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const locale = useLocale();
  const t = useTranslations("gallery");

  const sortedItems = initialGallery.items.slice().reverse();

  const slides = sortedItems.map((image) => ({
    src: `${process.env.NEXT_PUBLIC_CDN_URL}/${image.imageUrl}`,
    alt: image.title.az || "Gallery image",
  }));

  const getLocalizedTitle = (image: GalleryImage) =>
    locale === "ru" ? image.title.ru : image.title.az;

  return (
    <div
      id="gallery"
      className={cn(
        "flex flex-col gap-8 4xl:gap-12",
        !slider &&
          "container mx-auto " +
            "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 " +
            "2xl:px-20 3xl:px-24 4xl:px-32 " +
            "my-20 4xl:my-24"
      )}
    >
      <SectionTitle title={t("title")} description={t("description")} />

      {!slider && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 4xl:gap-8">
          {sortedItems.map((image, index) => (
            <div key={image.id} onClick={() => setCurrentImageIndex(index)}>
              <GalleryCard
                imageUrl={image.imageUrl}
                title={getLocalizedTitle(image)}
              />
            </div>
          ))}
        </div>
      )}

      {slider && (
        <GallerySlider
          handleItemClick={(index) => setCurrentImageIndex(index)}
          data={{ ...initialGallery, items: sortedItems }}
        />
      )}

      <Lightbox
        open={currentImageIndex >= 0}
        plugins={[Thumbnails]}
        index={currentImageIndex}
        close={() => setCurrentImageIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
