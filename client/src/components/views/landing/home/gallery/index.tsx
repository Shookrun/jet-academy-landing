// src/components/views/landing/home/gallery.tsx
import Button from "@/components/ui/button";
import api from "@/utils/api/axios";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";
import GalleryClient from "../../gallery/gallery-client";

const fetchGallery = async () => {
  try {
    const response = await api.get("/gallery?limit=30");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return null;
  }
};

export default async function Gallery() {
  try {
    const t = await getTranslations("gallery");
    const gallery = await fetchGallery();
    if (!gallery) return null;

    return (
      <div
        id="gallery"
        className="
          container mx-auto
          px-4 sm:px-6 md:px-4 lg:px-12 xl:px-16
          2xl:px-0 3xl:px-24 4xl:px-32
          my-20 4xl:my-24
          flex flex-col
          gap-8 4xl:gap-12
        "
      >
        <GalleryClient slider initialGallery={gallery} />

        <Link href="/gallery">
          <Button
            iconPosition="right"
            className="items-center mx-auto py-3 px-6 4xl:py-4 4xl:px-8 [@media(min-width:3500px)]:!text-2xl"
            icon={<MdArrowRightAlt size={24} className="[@media(min-width:3500px)]:!w-12 [@media(min-width:3500px)]:!h-12" />}
            text={t("seeAll")}
          />
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Gallery component error:", error);
    return null;
  }
}
