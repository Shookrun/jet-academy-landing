"use client";
import GlossaryCategoryForm from "@/components/views/dashboard/glossary/glossary-category-form";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface GlossaryCategoryFormInputs {
  name: {
    az: string;
    ru: string;
  };
  description?: {
    az: string;
    ru: string;
  };
  slug: {
    az: string;
    ru: string;
  };
  order?: number;
}

export default function CreateGlossaryCategoryPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GlossaryCategoryFormInputs>({
    defaultValues: {
      name: { az: "", ru: "" },
      description: { az: "", ru: "" },
      slug: { az: "", ru: "" },
      order: 0,
    },
  });

  const onSubmit = async (formData: GlossaryCategoryFormInputs) => {
    try {
    

      const response = await api.post("/glossary-categories", formData);

      if (response.status === 201) {
        toast.success("Kateqoriya uğurla yaradıldı");
        router.push("/dashboard/glossary/categories");
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
    <GlossaryCategoryForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      setValue={setValue}
      watch={watch}
    />
  );
}
