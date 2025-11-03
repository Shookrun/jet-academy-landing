"use client";
import CourseTeacherForm from "@/components/views/dashboard/course-teacher/course-teacher-form";
import { CourseTeacherFormInputs } from "@/types/team";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditCourseTeacherPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CourseTeacherFormInputs>();

  useEffect(() => {
    const fetchCourseTeacher = async () => {
      try {
        const { data } = await api.get(`/course-teacher/${params.id}`);
        reset({
          title: data.title,
          description: {
            az: data.description.az,
            en: data.description.en,
          },
        });
      } catch (error) {
        console.error("Məlumat yükləmə xətası:", error);
        toast.error("Məlumatlar yüklənə bilmədi");
        router.push("/dashboard/course-teacher");
      }
    };

    fetchCourseTeacher();
  }, [params.id, reset, router]);

  const onSubmit = async (data: CourseTeacherFormInputs) => {
    try {
      const response = await api.patch(`/course-teacher/${params.id}`, data);

      if (response.status === 200) {
        toast.success("Müəllim rolu uğurla yeniləndi");
        router.push("/dashboard/course-teacher");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  return (
    <CourseTeacherForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
    />
  );
}
