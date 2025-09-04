import { Role } from "@/types/enums";
import { Button, Card, Input, Select, SelectItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Controller } from "react-hook-form";
import {
  MdLock,
  MdMail,
  MdPerson,
  MdSupervisedUserCircle,
} from "react-icons/md";

interface UsersFormProps {
  mode: "create" | "edit";
  onSubmit: (data: any) => Promise<void>;
  register: any;
  control: any;
  errors: any;
  isSubmitting: boolean;
  handleSubmit: any;
  router: any;
  showPasswordField?: boolean;
}

export default function UsersForm({
  mode,
  onSubmit,
  register,
  control,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  showPasswordField = true,
}: UsersFormProps) {
  const roleOptions = [
    { key: Role.USER, value: Role.USER, label: "İstifadəçi" },
    { key: Role.STAFF, value: Role.STAFF, label: "İşçi" },
    {
      key: Role.CONTENTMANAGER,
      value: Role.CONTENTMANAGER,
      label: "Kontent-Menecer",
    },
    {
      key: Role.CRMOPERATOR,
      value: Role.CRMOPERATOR,
      label: "CRM Operator",
    },
    { key: Role.ADMIN, value: Role.ADMIN, label: "Admin" },
  ];

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full max-w-xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <MdSupervisedUserCircle size={48} className="text-jsyellow" />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mode === "create"
                ? "Yeni İstifadəçi Yarat"
                : "İstifadəçi Məlumatlarını Yenilə"}
            </motion.h1>
            {mode === "create" && (
              <motion.p
                className="text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                İstifadəçi məlumatlarını daxil edin
              </motion.p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                label="Ad"
                variant="bordered"
                startContent={<MdPerson className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("name", {
                  required: "Ad tələb olunur",
                  minLength: {
                    value: 2,
                    message: "Ad ən azı 2 simvol olmalıdır",
                  },
                })}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
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

            {showPasswordField && (
              <div className="space-y-2">
                <Input
                  type="password"
                  label={
                    mode === "create" ? "Şifrə" : "Yeni Şifrə (İstəyə bağlı)"
                  }
                  variant="bordered"
                  startContent={<MdLock className="text-gray-400" />}
                  isDisabled={isSubmitting}
                  {...register("password", {
                    required: mode === "create" ? "Şifrə tələb olunur" : false,
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
            )}

            <div className="space-y-2">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Rol"
                    selectedKeys={[field.value]}
                    onChange={(e) => field.onChange(e.target.value)}
                    variant="bordered"
                    classNames={{
                      trigger:
                        "bg-white border-2 hover:border-jsyellow focus:border-jsyellow",
                    }}
                  >
                    {roleOptions.map((role) => (
                      <SelectItem key={role.key} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => router.back()}
                variant="light"
                className="text-gray-600"
                size="lg"
              >
                Ləğv et
              </Button>
              <Button
                type="submit"
                className="bg-jsyellow text-white hover:bg-jsyellow/90 disabled:opacity-50"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {mode === "create"
                  ? isSubmitting
                    ? "Yaradılır..."
                    : "Yarat"
                  : isSubmitting
                  ? "Yenilənir..."
                  : "Yenilə"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
