"use client";
import CourseTeacherForm from "@/components/views/dashboard/course-teacher/course-teacher-form";
import { CourseTeacherFormInputs } from "@/types/team";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCourseTeacherPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseTeacherFormInputs>();

  const onSubmit = async (data: CourseTeacherFormInputs) => {
    try {
      const response = await api.post("/course-teacher", data);

      if (response.status === 201) {
        toast.success("Müəllim rolu uğurla yaradıldı");
        router.push("/dashboard/course-teacher");
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
    <CourseTeacherForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
    />
  );
}
