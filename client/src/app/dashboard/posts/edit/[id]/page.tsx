"use client";
import { useEffect, useState, useRef } from "react";
import PostForm from "@/components/views/dashboard/post/post-form";
import { EventStatus, PostType } from "@/types/enums";
import { Post, PostFormInputs } from "@/types/post";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInputs>({
    defaultValues: {
      title: { az: "", en: "" },
      content: { az: "", en: "" },
      slug: { az: "", en: "" },
      imageUrl: "",
      tags: [],
      postType: PostType.BLOG,
      published: false,
      eventDate: undefined,
      eventStatus: undefined,
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Post>(`/posts/${params.id}`);

        reset({
          title: data.title,
          content: data.content,
          slug: data.slug,
          imageUrl: data.imageUrl || "",
          tags: data.tags || [],
          postType: data.postType,
          published: data.published,
          eventDate: data.eventDate
            ? new Date(data.eventDate).toISOString().split("T")[0]
            : undefined,
          eventStatus: data.eventStatus,
        });

        if (data.imageUrl) {
          setPreviewUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Post yüklənmədi:", error);
        toast.error("Post yüklənə bilmədi");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, reset]);

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
      formData.append("title[en]", data.title.en);
      formData.append("content[az]", data.content.az);
      formData.append("content[en]", data.content.en);
      formData.append("slug[az]", data.slug.az);
      formData.append("slug[en]", data.slug.en);

      formData.append("published", String(data.published));
      formData.append("postType", data.postType);

      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      if (data.postType === PostType.EVENT) {
        if (data.eventDate) {
          formData.append("eventDate", new Date(data.eventDate).toISOString());
        }
        const eventStatus = data.eventStatus || EventStatus.UPCOMING;
        formData.append("eventStatus", eventStatus);
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
      }

      const response = await api.patch(`/posts/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Post uğurla yeniləndi");
        router.push("/dashboard/posts");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">Yüklənir...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Post tapılmadı</h1>
        <button
          className="mt-4 px-4 py-2 bg-jsyellow text-white rounded-md"
          onClick={() => router.push("/dashboard/posts")}
        >
          Geri qayıt
        </button>
      </div>
    );
  }

  return (
    <PostForm
      mode="edit"
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
