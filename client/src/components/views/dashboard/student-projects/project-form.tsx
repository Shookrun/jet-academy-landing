"use client";
import { Button, Card, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { MdCategory, MdDescription, MdLink, MdTitle } from "react-icons/md";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { ProjectFormInputs } from "@/types/student-projects";
import { STUDENT_PROJECT_CATEGORIES } from "@/constants/studentProjectCategories";
type Props = {
  mode: "create" | "edit";
  onSubmit: (data: ProjectFormInputs) => void;
  register: UseFormRegister<ProjectFormInputs>;
  errors: FieldErrors<ProjectFormInputs>;
  isSubmitting: boolean;
  handleSubmit: UseFormHandleSubmit<ProjectFormInputs>;
  router: any;
  control: Control<ProjectFormInputs>;
};

export default function ProjectForm({
  mode,
  onSubmit,
  register,
  errors,
  isSubmitting,
  handleSubmit,
  router,
  control,
}: Props) {
  const emptySet = useMemo<Set<string>>(() => new Set(), []);

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
        <Card className="w-full max-w-xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <motion.h1 className="text-2xl font-bold text-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {mode === "create" ? "Yeni Layihə Yarat" : "Layihəyə Düzəliş Et"}
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
                {...register("title.az", { required: "Başlıq tələb olunur", minLength: { value: 3, message: "Başlıq ən azı 3 simvol olmalıdır" } })}
                isInvalid={!!errors.title?.az}
                errorMessage={(errors.title?.az?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                label="Title (EN)"
                variant="bordered"
                startContent={<MdTitle className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("title.en", { required: "Title is required", minLength: { value: 3, message: "Минимум 3 символа" } })}
                isInvalid={!!errors.title?.en}
                errorMessage={(errors.title?.en?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                label="Təsvir (AZ)"
                variant="bordered"
                startContent={<MdDescription className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("description.az", { required: "Təsvir tələb olunur" })}
                isInvalid={!!errors.description?.az}
                errorMessage={(errors.description?.az?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                label="Description (EN)"
                variant="bordered"
                startContent={<MdDescription className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("description.en", { required: "Description is required" })}
                isInvalid={!!errors.description?.en}
                errorMessage={(errors.description?.en?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
              />
            </div>

            <div className="space-y-2">
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: "Kateqoriya seçin" }}
                render={({ field }) => (
                    <Select
                    label="Kateqoriya"
                    variant="bordered"
                    startContent={<MdCategory className="text-gray-400" />}
                    classNames={{ trigger: "bg-white border-2 hover:border-primary focus:border-primary", value: "bg-transparent" }}
                    selectionMode="single"
                    selectedKeys={field.value ? new Set([String(field.value)]) : emptySet}
                    onSelectionChange={(keys) => {
                      const selectedKey = Object.values(keys)[0];
                      field.onChange(selectedKey ? String(selectedKey) : "");
                    }}
                    placeholder="Kateqoriya seçin"
                    >
                    {STUDENT_PROJECT_CATEGORIES.map((c: { id: string; name: string }) => (
                      <SelectItem key={c.id} textValue={c.name}>
                      {c.name}
                      </SelectItem>
                    ))}
                    </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="url"
                label="Youtube Linki"
                variant="bordered"
                startContent={<MdLink className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("link", {
                  required: "Youtube linki tələb olunur",
                  pattern: { value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i, message: "Düzgün Youtube linki daxil edin" },
                })}
                isInvalid={!!errors.link}
                errorMessage={(errors.link?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={() => router.back()} variant="light" className="text-gray-600" size="lg" disabled={isSubmitting}>
                Ləğv et
              </Button>
              <Button type="submit" className="bg-jsyellow text-white hover:bg-jsyellow/90 disabled:opacity-50" size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
                {mode === "create" ? (isSubmitting ? "Yaradılır..." : "Yarat") : isSubmitting ? "Yenilənir..." : "Yenilə"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
