"use client";
import ProjectForm from "@/components/views/dashboard/student-projects/project-form";
import { ProjectFormInputs } from "@/types/student-projects";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const STATIC_CATEGORY_NAMES = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

async function ensureCategoryId(categoryId: string) {
  const isLocal = categoryId.startsWith("local-");
  if (!isLocal) return categoryId;

  const idx = Number(categoryId.replace("local-", ""));
  const name =
    Number.isFinite(idx) && STATIC_CATEGORY_NAMES[idx]
      ? STATIC_CATEGORY_NAMES[idx]
      : undefined;

  if (!name) throw new Error("Kateqoriya adı təyin edilə bilmədi");

  try {
    const created = await api.post("/student-project-categories", { name });
    const item = created?.data?.item || created?.data;
    if (item?.id) return String(item.id);
  } catch {}

  try {
    const res = await api.get("/student-project-categories");
    const items = res?.data?.items ?? [];
    const hit = items.find(
      (x: any) =>
        String(x?.name).trim().toLowerCase() === name.trim().toLowerCase()
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
        error?.response?.data?.message ||
          error?.message ||
          "Xəta baş verdi. Yenidən cəhd edin"
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
