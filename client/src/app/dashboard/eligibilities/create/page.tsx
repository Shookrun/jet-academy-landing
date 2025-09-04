"use client";
import EligibilityForm from "@/components/views/dashboard/eligibility/eligibility-form";
import { EligibilityFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateEligibilityPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: EligibilityFormInputs) => {
    try {
      const response = await api.post("/course-eligibility", data);
      if (response.status === 201) {
        toast.success("Tələb uğurla yaradıldı");
        router.push("/dashboard/eligibilities");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <EligibilityForm
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
