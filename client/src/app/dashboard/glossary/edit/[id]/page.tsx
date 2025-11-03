"use client";
import GlossaryForm from "@/components/views/dashboard/glossary/glossary-form";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function EditGlossaryTermPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<GlossaryFormInputs | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GlossaryFormInputs>();

  useEffect(() => {
    register("tags");
    register("relatedTerms");
    register("definition.az", { required: "Tərif (AZ) tələb olunur" });
    register("definition.en", { required: "Definition (EN) is required" });
    register("published");
  }, [register]);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const { data } = await api.get(`/glossary/${params.id}`);
        setOriginalData(data);
        reset({
          term: data.term,
          definition: data.definition,
          slug: data.slug,
          categoryId: data.categoryId || undefined,
          tags: data.tags || [],
          relatedTerms: data.relatedTerms || [],
          published: data.published || false,
        });
      } catch (error) {
        console.error("Termin məlumatlarını yükləmə xətası:", error);
        toast.error("Termin məlumatları yüklənə bilmədi");
        router.push("/dashboard/glossary");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerm();
  }, [params.id, reset, router]);

  const onSubmit = async (formData: GlossaryFormInputs) => {
    try {
      const changedData = getChangedFields(originalData, formData);

    
      if (Object.keys(changedData).length === 0) {
        toast.info("Heç bir dəyişiklik edilmədi");
        router.push("/dashboard/glossary");
        return;
      }

      const response = await api.patch(`/glossary/${params.id}`, changedData);

      if (response.status === 200) {
        toast.success("Termin uğurla yeniləndi");
        router.push("/dashboard/glossary");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  const getChangedFields = (
    original: any,
    updated: any
  ): Partial<GlossaryFormInputs> => {
    if (!original) return updated;

    const changes: Partial<GlossaryFormInputs> = {};

    // Compare term fields
    if (
      original.term?.az !== updated.term?.az ||
      original.term?.en !== updated.term?.en
    ) {
      changes.term = { ...updated.term };
    }

    if (
      original.definition?.az !== updated.definition?.az ||
      original.definition?.en !== updated.definition?.en
    ) {
      changes.definition = { ...updated.definition };
    }

    if (
      original.slug?.az !== updated.slug?.az ||
      original.slug?.en !== updated.slug?.en
    ) {
      changes.slug = { ...updated.slug };
    }

    if (original.categoryId !== updated.categoryId) {
      changes.categoryId = updated.categoryId;
    }

    if (original.published !== updated.published) {
      changes.published = updated.published;
    }

    if (JSON.stringify(original.tags) !== JSON.stringify(updated.tags)) {
      changes.tags = [...updated.tags];
    }

    if (
      JSON.stringify(original.relatedTerms) !==
      JSON.stringify(updated.relatedTerms)
    ) {
      changes.relatedTerms = [...updated.relatedTerms];
    }

    return changes;
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen w-full flex items-center justify-center">
        <p>Yüklənir...</p>
      </div>
    );
  }

  return (
    <GlossaryForm
      mode="edit"
      initialValues={originalData}
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
