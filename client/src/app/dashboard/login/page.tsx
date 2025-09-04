"use client";
import { Button, Card, Checkbox, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdDashboard, MdLock, MdMail } from "react-icons/md";
import { toast } from "sonner";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      remember: data.remember,
      redirect: false,
      callbackUrl,
    })
      .then((result) => {
        if (!result) {
          toast.error("Email və ya şifrə yanlışdır");
          return;
        }

        if (result.error) {
          toast.error(result.error || "Email və ya şifrə yanlışdır");
          return;
        }

        toast.success("Giriş uğurla başa çatdı");
        router.push("/dashboard/requests");
        router.refresh();
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Xəta baş verdi. Yenidən cəhd edin");
      });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-6 bg-white shadow-lg">
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <MdDashboard size={48} className="text-jsyellow" />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              İdarə Panelinə Giriş
            </motion.h1>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Davam etmək üçün məlumatlarınızı daxil edin
            </motion.p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                label="E-poçt"
                variant="bordered"
                startContent={<MdMail className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("email", {
                  required: "E-poçt tələb olunur",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Yanlış e-poçt ünvanı",
                  },
                })}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-jsyellow focus:border-jsyellow",
                  ],
                }}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                label="Şifrə"
                variant="bordered"
                startContent={<MdLock className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("password", {
                  required: "Şifrə tələb olunur",
                  minLength: {
                    value: 6,
                    message: "Şifrə ən azı 6 simvol olmalıdır",
                  },
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-jsyellow focus:border-jsyellow",
                  ],
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                {...register("remember")}
                isDisabled={isSubmitting}
                classNames={{
                  label: "text-gray-600",
                }}
              >
                Məni xatırla
              </Checkbox>

              <Button
                href="/dashboard/forgot-password"
                as="a"
                variant="light"
                className="text-jsyellow font-medium p-0"
                size="sm"
              >
                Şifrəni unutmusunuz?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-jsyellow text-white hover:bg-jsyellow/90 disabled:opacity-50"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Giriş edilir..." : "Daxil ol"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
