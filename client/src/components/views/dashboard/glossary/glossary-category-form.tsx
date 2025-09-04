/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/utils/api/axios";
import { slugifyText } from "@/utils/slugify"; // Import slugify function
import { Button, Card, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { MdDescription, MdNumbers, MdTitle } from "react-icons/md";

interface GlossaryCategoryFormProps {
  mode: "create" | "edit";
  onSubmit: (data: any) => Promise<void>;
  register: any;
  errors: any;
  isSubmitting: boolean;
  handleSubmit: any;
  router: any;
  initialValues?: any;
  setValue?: any;
  watch?: any;
}

export default function GlossaryCategoryForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  initialValues,
  setValue,
  watch,
}: GlossaryCategoryFormProps) {
  const handleNameChange = (lang: string, value: string) => {
    if (setValue) {
      const slugValue = slugifyText(value);
      setValue(`slug.${lang}`, slugValue);
    }
  };

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
              {mode === "create"
                ? "Yeni Kateqoriya Yarat"
                : "Kateqoriyaya Düzəliş Et"}
            </motion.h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                label="Ad (AZ)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("name.az", {
                  required: "Kateqoriya adı tələb olunur",
                  minLength: {
                    value: 2,
                    message: "Ad ən azı 2 simvol olmalıdır",
                  },
                  onChange: (e: any) => handleNameChange("az", e.target.value),
                })}
                isInvalid={!!errors.name?.az}
                errorMessage={errors.name?.az?.message}
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
                label="Название (RU)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("name.ru", {
                  required: "Название категории обязательно",
                  minLength: {
                    value: 2,
                    message: "Минимум 2 символа",
                  },
                  onChange: (e: any) => handleNameChange("ru", e.target.value),
                })}
                isInvalid={!!errors.name?.ru}
                errorMessage={errors.name?.ru?.message}
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
                {...register("description.az")}
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
                {...register("description.ru")}
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
                label="Slug (AZ)"
                readOnly
                disabled
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={true}
                {...register("slug.az")}
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
                label="Slug (RU)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={true}
                {...register("slug.ru")}
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
                type="number"
                label="Sıralama"
                variant="bordered"
                startContent={<MdNumbers className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("order", {
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.order}
                errorMessage={errors.order?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-primary focus:border-primary",
                  ],
                }}
              />
              <p className="text-xs text-gray-500">
                Kiçik ədəd daha yüksək sıralamaya səbəb olur. Boş saxlasanız,
                avtomatik olaraq sonuncu sıraya əlavə olunacaq.
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
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
