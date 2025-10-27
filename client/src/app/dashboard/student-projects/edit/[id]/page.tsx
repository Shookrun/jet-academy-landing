"use client";
import ProjectForm from "@/components/views/dashboard/student-projects/project-form";
import { ProjectFormInputs } from "@/types/student-projects";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    control, // <<< lazım olacaq
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/student-projects/${params.id}`);
        reset(data); // formu burda doldururuq, ayrıca initialValues lazım deyil
      } catch (error) {
        console.error("Layihə məlumatlarını yükləmə xətası:", error);
        toast.error("Layihə məlumatları yüklənə bilmədi");
        router.push("/dashboard/student-projects");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [params.id, reset, router]);

  const getChangedFields = (original: any, updated: any): Partial<ProjectFormInputs> => {
    if (!original) return updated;

    const changes: Partial<ProjectFormInputs> = {};

    if (original.title?.az !== updated.title?.az || original.title?.ru !== updated.title?.ru) {
      changes.title = { ...updated.title };
    }
    if (original.description?.az !== updated.description?.az || original.description?.ru !== updated.description?.ru) {
      changes.description = { ...updated.description };
    }
    if (original.link !== updated.link) {
      changes.link = updated.link;
    }
    if (original.categoryId !== updated.categoryId) {
      changes.categoryId = updated.categoryId;
    }
    if (original.imageUrl !== updated.imageUrl) {
      changes.imageUrl = updated.imageUrl;
    }

    return changes;
  };

  const onSubmit = async (formData: ProjectFormInputs) => {
    try {
      // Backend-dən gələn orijinal dəyərləri almaq üçün bir daha GET etməkdənsə,
      // reset-dən əvvəlki dəyərləri saxlamırsansa, sadəcə patch-i bütün formData ilə də ata bilərsən.
      // Amma sənin mövcud məntiqinə toxunmadan davam:
      const { data: original } = await api.get(`/student-projects/${params.id}`);
      const changedData = getChangedFields(original, formData);

      if (Object.keys(changedData).length === 0) {
        toast.info("Heç bir dəyişiklik edilmədi");
        router.push("/dashboard/student-projects");
        return;
      }

      const response = await api.patch(`/student-projects/${params.id}`, changedData);
      if (response.status === 200) {
        toast.success("Layihə uğurla yeniləndi");
        router.push("/dashboard/student-projects");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(error?.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen w-full flex items-center justify-center">
        <p>Yüklənir...</p>
      </div>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      control={control}
    />
  );
}
