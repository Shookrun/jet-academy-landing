"use client";
import CourseForm from "@/components/views/dashboard/courses/course-form";
import { CourseFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInputs>({
    defaultValues: {
      title: { az: "", ru: "" },
      description: { az: "", ru: "" },
      slug: { az: "", ru: "" },
      level: { az: "Başlanğıc", ru: "Начинающий" },
      duration: 0,
      published: false,
      ageRange: "",
      icon: "FaStar",
      newTags: { az: [], ru: [] },
    },
  });

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


if (data.image) {
  const imageFile = data.image instanceof FileList ? data.image[0] : data.image;
  if (imageFile) {
    formData.append("image", imageFile);
  }
}

      const response = await api.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Kurs uğurla yaradıldı");
        router.push("/dashboard/courses");
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
    <CourseForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      watch={watch}
      setValue={setValue}
    />
  );
}