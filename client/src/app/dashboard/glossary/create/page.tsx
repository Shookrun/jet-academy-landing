"use client";
import GlossaryForm from "@/components/views/dashboard/glossary/glossary-form";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface GlossaryFormInputs {
  term: {
    az: string;
    en: string;
  };
  definition: {
    az: string;
    en: string;
  };
  slug: {
    az: string;
    en: string;
  };
  categoryId?: string;
  tags: string[];
  relatedTerms: string[];
  published: boolean;
}

export default function CreateGlossaryTermPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<GlossaryFormInputs>({
    defaultValues: {
      published: false,
      tags: [],
      relatedTerms: [],
      definition: {
        az: "",
        en: "",
      },
    },
  });

  register("tags");
  register("relatedTerms");
  register("definition.az", { required: "Tərif (AZ) tələb olunur" });
  register("definition.en", { required: "Definition (EN) is required" });
  register("published");

  const onSubmit = async (data: GlossaryFormInputs) => {
    try {
      const formData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [],
        relatedTerms: Array.isArray(data.relatedTerms) ? data.relatedTerms : [],
      };

      const response = await api.post("/glossary", formData);

      if (response.status === 201) {
        toast.success("Termin uğurla yaradıldı");
        router.push("/dashboard/glossary");
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
    <GlossaryForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      setValue={setValue}
      getValues={getValues}
      watch={watch}
    />
  );
}
