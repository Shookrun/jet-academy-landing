"use client";
import { Role } from "@/types/enums";
import api from "@/utils/api/axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import UsersForm from "@/components/views/dashboard/users/users-form";

interface CreateUserFormInputs {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export default function CreateUserPage() {
  const router = useRouter();
  const {
    register,
    control,

    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.USER,
    },
  });

  const onSubmit = async (data: CreateUserFormInputs) => {
    try {
      const response = await api.post("/auth/register", data);

      if (response.status === 201) {
        toast.success("İstifadəçi uğurla yaradıldı");
        router.push("/dashboard/users");
        router.refresh();
      }
    } catch (error: any) {
      console.error("İstifadəçi yaradılması uğursuz oldu:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  return (
    <UsersForm
      mode="create"
      onSubmit={onSubmit}
      register={register}
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
    />
  );
}
