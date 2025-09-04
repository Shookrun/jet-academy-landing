"use client";
import EligibilityForm from "@/components/views/dashboard/eligibility/eligibility-form";
import { EligibilityFormInputs } from "@/types/course";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditEligibilityPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const { data } = await api.get(`/course-eligibility/${params.id}`);
        const dataWithoutId = {
          ...data,
          id: undefined,
          courses: undefined,
        };
        reset({ ...dataWithoutId });
      } catch (error: any) {
        console.error("Tələb məlumatlarını yükləmə xətası:", error);
        toast.error("Tələb məlumatları yüklənə bilmədi");
        router.push("/dashboard/eligibilities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibility();
  }, [params.id, reset, router]);

  const onSubmit = async (data: EligibilityFormInputs) => {
    try {
      const response = await api.patch(
        `/course-eligibility/${params.id}`,
        data
      );
      if (response.status === 200) {
        toast.success("Tələb uğurla yeniləndi");
        router.push("/dashboard/eligibilities");
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
    <EligibilityForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
    />
  );
}
