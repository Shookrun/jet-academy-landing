"use client";

import GalleryForm from "@/components/views/dashboard/gallery/gallery-form";
import { GalleryFormInputs } from "@/types/gallery";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateGalleryItemPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormInputs>();

  const onSubmit = async (data: GalleryFormInputs) => {
    try {
      const formData = new FormData();
      if (data.title) {
        formData.append("title[az]", data.title.az);
        formData.append("title[en]", data.title.en);
      }
      formData.append("image", data.image[0]);

      const response = await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Şəkil uğurla əlavə edildi");
        router.push("/dashboard/gallery");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yaradılma xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  return (
    <GalleryForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      setValue={setValue}
    />
  );
}
