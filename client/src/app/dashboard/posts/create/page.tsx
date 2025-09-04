"use client";
import PostForm from "@/components/views/dashboard/post/post-form";
import { EventStatus, PostType } from "@/types/enums";
import { PostFormInputs } from "@/types/post";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRef, useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInputs>({
    defaultValues: {
      title: { az: "", ru: "" },
      content: { az: "", ru: "" },
      slug: { az: "", ru: "" },
      imageUrl: "",
      tags: [],
      postType: PostType.BLOG,
      published: false,
      eventDate: undefined,
      eventStatus: undefined,
      offerStartDate: undefined,
      offerEndDate: undefined,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = async (data: PostFormInputs) => {
    try {
      const formData = new FormData();

      formData.append("title[az]", data.title.az);
      formData.append("title[ru]", data.title.ru);
      formData.append("content[az]", data.content.az);
      formData.append("content[ru]", data.content.ru);
      formData.append("slug[az]", data.slug.az);
      formData.append("slug[ru]", data.slug.ru);

      formData.append("published", String(data.published));
      formData.append("postType", data.postType);

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      if (data.postType === PostType.EVENT) {
        if (data.eventDate) {
          formData.append("eventDate", data.eventDate);
        }
        const eventStatus = data.eventStatus || EventStatus.UPCOMING;
        formData.append("eventStatus", eventStatus);
      }

      if (data.postType === PostType.OFFERS) {
        if (data.offerStartDate) {
          formData.append("offerStartDate", data.offerStartDate);
        }
        if (data.offerEndDate) {
          formData.append("offerEndDate", data.offerEndDate);
        }
      }

      if (data.image) {
        const imageFile =
          data.image instanceof File
            ? data.image
            : data.image[0] instanceof File
            ? data.image[0]
            : null;

        if (imageFile) {
          formData.append("image", imageFile);
        }
      } else if (data.imageUrl && data.imageUrl.trim() !== "") {
        formData.append("imageUrl", data.imageUrl);
      }

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Post uğurla yaradıldı");
        router.push("/dashboard/posts");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yaratma xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  return (
    <PostForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      watch={watch}
      setValue={setValue}
      fileInputRef={fileInputRef}
      handleFileChange={handleFileChange}
      previewUrl={previewUrl}
    />
  );
}
