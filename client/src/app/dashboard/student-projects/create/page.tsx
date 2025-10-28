"use client";
import ProjectForm from "@/components/views/dashboard/student-projects/project-form";
import { STUDENT_PROJECT_CATEGORIES } from "@/constants/studentProjectCategories";
import { ProjectFormInputs } from "@/types/student-projects";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

async function ensureCategoryId(categoryId: string) {
  if (!categoryId?.startsWith("local-")) return categoryId;

  const cat = STUDENT_PROJECT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat?.name) throw new Error("Kateqoriya adı təyin edilə bilmədi");

  try {
    const created = await api.post("/student-project-categories", { name: cat.name });
    const item = created?.data?.item || created?.data;
    if (item?.id) return String(item.id);
  } catch {}

  try {
    const res = await api.get("/student-project-categories");
    const items = res?.data?.items ?? [];
    const hit = items.find(
      (x: any) => String(x?.name || "").trim().toLowerCase() === cat.name.trim().toLowerCase()
    );
    if (hit?.id) return String(hit.id);
  } catch {}

  throw new Error("Kateqoriya ID tapılmadı və yaradıla bilmədi");
}

export default function CreateProjectPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<ProjectFormInputs>({
    defaultValues: {
      title: { az: "", ru: "" },
      description: { az: "", ru: "" },
      categoryId: "",
      link: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: ProjectFormInputs) => {
    try {
      const realCategoryId = await ensureCategoryId(data.categoryId);
      const payload = { ...data, categoryId: realCategoryId };

      const res = await api.post("/student-projects", payload);
      if (res.status === 201) {
        toast.success("Layihə uğurla yaradıldı");
        reset();
        router.push("/dashboard/student-projects");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yaradılma xətası:", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Xəta baş verdi. Yenidən cəhd edin"
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
      control={control}
    />
  );
}
