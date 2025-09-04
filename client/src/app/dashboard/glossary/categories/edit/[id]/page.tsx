"use client";
import GlossaryCategoryForm from "@/components/views/dashboard/glossary/glossary-category-form";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function EditGlossaryCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] =
    useState<GlossaryCategoryFormInputs | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GlossaryCategoryFormInputs>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await api.get(`/glossary-categories/${params.id}`);

        setOriginalData(data);

        reset({
          name: data.name,
          description: data.description || { az: "", ru: "" },
          slug: data.slug,
          order: data.order || 0,
        });
      } catch (error) {
        console.error("Kateqoriya məlumatlarını yükləmə xətası:", error);
        toast.error("Kateqoriya məlumatları yüklənə bilmədi");
        router.push("/dashboard/glossary/categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, reset, router]);

  const onSubmit = async (formData: GlossaryCategoryFormInputs) => {
    try {
      const changedData = getChangedFields(originalData, formData);

    

      if (Object.keys(changedData).length === 0) {
        toast.info("Heç bir dəyişiklik edilmədi");
        router.push("/dashboard/glossary/categories");
        return;
      }

      const response = await api.patch(
        `/glossary-categories/${params.id}`,
        changedData
      );

      if (response.status === 200) {
        toast.success("Kateqoriya uğurla yeniləndi");
        router.push("/dashboard/glossary/categories");
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
  ): Partial<GlossaryCategoryFormInputs> => {
    if (!original) return updated;

    const changes: Partial<GlossaryCategoryFormInputs> = {};

    if (
      original.name?.az !== updated.name?.az ||
      original.name?.ru !== updated.name?.ru
    ) {
      changes.name = { ...updated.name };
    }

    if (
      original.description?.az !== updated.description?.az ||
      original.description?.ru !== updated.description?.ru
    ) {
      changes.description = { ...updated.description };
    }

    if (
      original.slug?.az !== updated.slug?.az ||
      original.slug?.ru !== updated.slug?.ru
    ) {
      changes.slug = { ...updated.slug };
    }

    if (original.order !== updated.order) {
      changes.order = updated.order;
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
    <GlossaryCategoryForm
      mode="edit"
      initialValues={originalData}
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
