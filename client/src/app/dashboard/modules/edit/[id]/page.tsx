"use client";
import ModuleForm from "@/components/views/dashboard/modules/module-form";
import { ModuleFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

export default function EditModulePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content",
  });

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const { data } = await api.get(`/course-modules/${params.id}`);
        reset({
          ...data,
          id: undefined,
          courses: undefined,
        });
      } catch (error) {
        console.error("Modul məlumatları yüklənmədi:", error);
        toast.error("Modul məlumatları yüklənə bilmədi");
        router.push("/dashboard/modules");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModule();
  }, [params.id, reset, router]);

  const onSubmit = async (data: ModuleFormInputs) => {
    try {
      const response = await api.patch(`/course-modules/${params.id}`, data);
      if (response.status === 200) {
        toast.success("Modul uğurla yeniləndi");
        router.push("/dashboard/modules");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
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
    <ModuleForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      fields={fields}
      append={append}
      remove={remove}
    />
  );
}
