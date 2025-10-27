"use client";
import api from "@/utils/api/axios";
import { Button, Card, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCategory, MdDescription, MdLink, MdTitle } from "react-icons/md";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { ProjectFormInputs } from "@/types/student-projects";

type Category = { id: string; name: string };

const STATIC_CATEGORIES: Category[] = [
  { id: "local-0", name: "Front-End" },
  { id: "local-1", name: "Full Stack" },
  { id: "local-2", name: "Python Back-End" },
  { id: "local-3", name: "Java Back-End" },
  { id: "local-4", name: "IT Help Desk" },
  { id: "local-5", name: "Kibertəhlükəsizlik" },
  { id: "local-6", name: "Ofis Proqramları" },
  { id: "local-7", name: "Praktiki Kompüter Bilikləri" },
  {id:"local-8",name:"AI Engineering Kursu"}
];

const dedupeByName = (arr: Category[]) => {
  const seen = new Set<string>();
  return arr.filter((c) => {
    const k = c.name.trim().toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

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
  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    let active = true;
    (async () => {
      try {
        const res = await api.get("/student-project-categories");
        const items: Category[] = (res?.data?.items ?? []).map((x: any) => ({
          id: String(x.id),
          name: x.name,
        }));
        if (!active) return;
        if (items.length > 0) {
          setCategories(dedupeByName(items));
        } else {
          setCategories(STATIC_CATEGORIES);
        }
      } catch {
        if (!active) return;
        setCategories(STATIC_CATEGORIES);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const selectedKeys = useMemo<Set<string>>(() => new Set(), []);

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
                {...register("title.az", {
                  required: "Başlıq tələb olunur",
                  minLength: { value: 3, message: "Başlıq ən azı 3 simvol olmalıdır" },
                })}
                isInvalid={!!errors.title?.az}
                errorMessage={(errors.title?.az?.message as any) || undefined}
                classNames={{ input: "bg-transparent", inputWrapper: "bg-white border-2 hover:border-primary focus:border-primary" }}
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
                  minLength: { value: 3, message: "Минимум 3 символа" },
                })}
                isInvalid={!!errors.title?.ru}
                errorMessage={(errors.title?.ru?.message as any) || undefined}
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
                label="Описание (RU)"
                variant="bordered"
                startContent={<MdDescription className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("description.ru", { required: "Описание обязательно" })}
                isInvalid={!!errors.description?.ru}
                errorMessage={(errors.description?.ru?.message as any) || undefined}
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
                    selectedKeys={field.value ? new Set([String(field.value)]) : selectedKeys}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys as Set<React.Key>)[0];
                      field.onChange(key ? String(key) : "");
                    }}
                    isInvalid={!!errors.categoryId}
                    errorMessage={(errors.categoryId?.message as any) || undefined}
                    placeholder="Kateqoriya seçin"
                  >
                    {dedupeByName(categories).map((c) => (
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
                  pattern: {
                    value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
                    message: "Düzgün Youtube linki daxil edin",
                  },
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
