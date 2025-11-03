"use client";
import ModuleForm from "@/components/views/dashboard/modules/module-form";
import { ModuleFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

export default function CreateModulePage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      content: [{ az: "", en: "", order: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content",
  });

  const onSubmit = async (data: ModuleFormInputs) => {
    try {
      const response = await api.post("/course-modules", data);
      if (response.status === 201) {
        toast.success("Modul uğurla yaradıldı");
        router.push("/dashboard/modules");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <ModuleForm
      mode="create"
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
