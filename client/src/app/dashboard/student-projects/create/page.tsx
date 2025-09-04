"use client";
import ProjectForm from "@/components/views/dashboard/student-projects/project-form";
import { ProjectFormInputs } from "@/types/student-projects";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateProjectPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>();

  const onSubmit = async (data: ProjectFormInputs) => {
    try {
      const response = await api.post("/student-projects", data);

      if (response.status === 201) {
        toast.success("Layihə uğurla yaradıldı");
        router.push("/dashboard/student-projects");
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
    <ProjectForm
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
