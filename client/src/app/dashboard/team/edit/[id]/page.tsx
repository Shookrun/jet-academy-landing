"use client";

import TeamMemberForm from "@/components/views/dashboard/team/team-member-form";
import { TeamMemberFormInputs } from "@/types/team";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTeamMemberPage({
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormInputs>();

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const { data } = await api.get(`/team/${params.id}`);
        reset(data);
      } catch (error) {
        console.error("Komanda üzvü məlumatlarını yükləmə xətası:", error);
        toast.error("Komanda üzvü məlumatları yüklənə bilmədi");
        router.push("/dashboard/team");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMember();
  }, [params.id, reset, router]);

  const onSubmit = async (data: TeamMemberFormInputs) => {
    try {
      const fullName = `${data.name} ${data.surname}`;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("fullName", fullName);
      formData.append(
        "bio",
        JSON.stringify({
          az: data.bio.az,
          ru: data.bio.ru,
        })
      );

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await api.patch(`/team/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Komanda üzvü məlumatları uğurla yeniləndi");
        router.push("/dashboard/team");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Yeniləmə xətası:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
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
    <TeamMemberForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      setValue={setValue}
    />
  );
}
