"use client";
import { EligibilityFormInputs } from "@/types/course";
import { Button, Card, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { MdDescription, MdStar, MdTitle } from "react-icons/md";

interface EligibilityFormProps {
  mode: "create" | "edit";
  onSubmit: (data: EligibilityFormInputs) => Promise<void>;
  register: any;
  errors: any;
  isSubmitting: boolean;
  handleSubmit: any;
  router: any;
}
export default function EligibilityForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
}: EligibilityFormProps) {
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
            <motion.h1
              className="text-2xl font-bold text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mode === "create" ? "Yeni Tələb Yarat" : "Tələbə Düzəliş Et"}
            </motion.h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                label="Başlıq (AZ)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("title.az", {
                  required: "Başlıq tələb olunur",
                  minLength: {
                    value: 3,
                    message: "Başlıq ən azı 3 simvol olmalıdır",
                  },
                })}
                isInvalid={!!errors.title?.az}
                errorMessage={errors.title?.az?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                label="Заголовок (RU)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("title.ru", {
                  required: "Заголовок обязателен",
                  minLength: {
                    value: 3,
                    message: "Минимум 3 символа",
                  },
                })}
                isInvalid={!!errors.title?.ru}
                errorMessage={errors.title?.ru?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                label="Təsvir (AZ)"
                variant="bordered"
                startContent={<MdDescription className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("description.az", {
                  required: "Təsvir tələb olunur",
                })}
                isInvalid={!!errors.description?.az}
                errorMessage={errors.description?.az?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                label="Описание (RU)"
                variant="bordered"
                startContent={<MdDescription className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("description.ru", {
                  required: "Описание обязательно",
                })}
                isInvalid={!!errors.description?.ru}
                errorMessage={errors.description?.ru?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                label="İkon"
                variant="bordered"
                startContent={<MdStar className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("icon", {
                  required: "İkon tələb olunur",
                })}
                isInvalid={!!errors.icon}
                errorMessage={errors.icon?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
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
