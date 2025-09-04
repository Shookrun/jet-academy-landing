"use client";
import CourseForm from "@/components/views/dashboard/courses/course-form";
import { CourseFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<CourseFormInputs | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInputs>();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${params.id}`);
        const formData = {
          title: data.title || { az: "", ru: "" },
          description: data.description || { az: "", ru: "" },
          shortDescription: data.shortDescription || { az: "", ru: "" },
          slug: data.slug || { az: "", ru: "" },
          level: data.level || { az: "Başlanğıc", ru: "Начинающий" },
          duration: data.duration || 0,
          published: data.published || false,
          icon: data.icon || "FaStar",
          ageRange: data.ageRange || "",
          backgroundColor: data.backgroundColor || "#FEF3C7",
          borderColor: data.borderColor || "#F59E0B",
          textColor: data.textColor || "#1F2937",
          newTags: data.newTags || { az: [], ru: [] },
          imageUrl: data.imageUrl || "",
          tag: data.tag || [],
        };
        
        setOriginalData(data);
        reset(formData);
      } catch (error) {
        console.error("Kurs məlumatlarını yükləmə xətası:", error);
        toast.error("Kurs məlumatları yüklənə bilmədi");
        router.push("/dashboard/courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id, reset, router]);

  const onSubmit = async (data: CourseFormInputs) => {
    try {
      const formData = new FormData();

     
      formData.append("title[az]", data.title.az);
      formData.append("title[ru]", data.title.ru);
      formData.append("description[az]", data.description.az);
      formData.append("description[ru]", data.description.ru);
      formData.append("slug[az]", data.slug.az);
      formData.append("slug[ru]", data.slug.ru);
      formData.append("level[az]", data.level.az);
      formData.append("level[ru]", data.level.ru);

      if (data.shortDescription?.az) {
        formData.append("shortDescription[az]", data.shortDescription.az);
      }
      if (data.shortDescription?.ru) {
        formData.append("shortDescription[ru]", data.shortDescription.ru);
      }

      if (data.newTags?.az && data.newTags.az.length > 0) {
        data.newTags.az.forEach((tag, index) => {
          formData.append(`newTags[az][${index}]`, tag);
        });
      }
      if (data.newTags?.ru && data.newTags.ru.length > 0) {
        data.newTags.ru.forEach((tag, index) => {
          formData.append(`newTags[ru][${index}]`, tag);
        });
      }


      formData.append("duration", Number(data.duration).toString());
      formData.append("published", data.published.toString());
      formData.append("icon", data.icon || "FaStar");
      
      if (data.ageRange) {
        formData.append("ageRange", data.ageRange);
      }

      if (data.backgroundColor) {
        formData.append("backgroundColor", data.backgroundColor);
      }
      if (data.borderColor) {
        formData.append("borderColor", data.borderColor);
      }
      if (data.textColor) {
        formData.append("textColor", data.textColor);
      }


      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await api.patch(`/courses/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {

        const updatedCourse = response.data;
        setOriginalData(updatedCourse);
        

        reset({
          title: updatedCourse.title || { az: "", ru: "" },
          description: updatedCourse.description || { az: "", ru: "" },
          shortDescription: updatedCourse.shortDescription || { az: "", ru: "" },
          slug: updatedCourse.slug || { az: "", ru: "" },
          level: updatedCourse.level || { az: "Başlanğıc", ru: "Начинающий" },
          duration: updatedCourse.duration || 0,
          published: updatedCourse.published || false,
          icon: updatedCourse.icon || "FaStar",
          ageRange: updatedCourse.ageRange || "",
          backgroundColor: updatedCourse.backgroundColor || "#FEF3C7",
          borderColor: updatedCourse.borderColor || "#F59E0B",
          textColor: updatedCourse.textColor || "#1F2937",
          newTags: updatedCourse.newTags || { az: [], ru: [] },
          imageUrl: updatedCourse.imageUrl || "",
          tag: updatedCourse.tag || [],
        });

        toast.success("Kurs uğurla yeniləndi");
        router.push("/dashboard/courses");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Kurs məlumatları yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <CourseForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      initialValues={originalData}
      router={router}
      watch={watch}
      setValue={setValue}
    />
  );
}