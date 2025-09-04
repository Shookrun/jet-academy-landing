"use client";
import UsersForm from "@/components/views/dashboard/users/users-form";
import { Role } from "@/types/enums";
import api from "@/utils/api/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdateUserFormInputs {
  name: string;
  email: string;
  password?: string;
  role: Role;
  categoryId?: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormInputs>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${params.id}`);
        reset({
          name: data.name,
          email: data.email,
          role: data.role,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("İstifadəçi məlumatları yüklənmədi");
        router.push("/dashboard/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id, reset, setValue, router]);

  const onSubmit = async (data: UpdateUserFormInputs) => {
    try {
      if (!data.password) {
        delete data.password;
      }

      const payload = {
        ...data,
      };

      const response = await api.patch(`/users/${params.id}`, payload);

      if (response.status === 200) {
        toast.success("İstifadəçi məlumatları yeniləndi");
        router.push("/dashboard/users");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Update error:", error);
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
    <UsersForm
      mode="edit"
      onSubmit={onSubmit}
      register={register}
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      router={router}
      showPasswordField={session?.user?.role === Role.ADMIN}
    />
  );
}
