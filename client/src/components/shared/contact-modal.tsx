"use client";
import { useContactModal } from "@/hooks/useContactModal";
import { useTranslations, useLocale } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdClose, MdOutlineCheck } from "react-icons/md";
import { RequestFormInputs, Language } from "@/types/request";
import axios, { AxiosError } from "axios";
import api from "@/utils/api/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Select from "../ui/select";
import { Locale } from "@/i18n/request";

type CourseItem = { id: string; title?: Record<string, string> };
type FormValues = RequestFormInputs & { courseId?: string };

const ADVICE_VALUE = "__advice__";

export default function ContactModal() {
  const t = useTranslations("contact.form");
  const locale = useLocale() as Locale;
  const { isOpen, toggle } = useContactModal();

  const [success, setSuccess] = useState(false);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      childAge: 12,
      childLanguage: Language.AZ,
      courseId: ADVICE_VALUE,
    },
  });

  const selectedCourseId = watch("courseId");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/courses", { params: { page: 1, limit: 100 } });
        const items: CourseItem[] = res.data?.items ?? res.data ?? [];
        const opts = items.map((c) => ({
          value: String(c.id),
          label:
            (c.title?.[locale] ||
              c.title?.az ||
              c.title?.en ||
              c.title?.ru ||
              "Adsız kurs") as string,
        }));
        const withAdvice = [
          { value: ADVICE_VALUE, label: t("adviceOption") ?? "Məsləhət almaq istəyirəm" },
          ...opts,
        ];
        if (active) setCourseOptions(withAdvice);
      } catch (e) {
        console.error("Kurs siyahısı alınmadı:", e);
        if (active)
          setCourseOptions([
            { value: ADVICE_VALUE, label: t("adviceOption") ?? "Məsləhət almaq istəyirəm" },
          ]);
      }
    })();
    return () => {
      active = false;
    };
  }, [locale, t]);

  const selectedCourseTitle = useMemo(() => {
    const hit = courseOptions.find((o) => o.value === selectedCourseId);
    return hit?.label;
  }, [courseOptions, selectedCourseId]);

  const handleCourseChange = (value: string | number) => {
    setValue("courseId", String(value), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const isAdvice = !data.courseId || data.courseId === ADVICE_VALUE;

      const payload = {
        name: data.name?.trim(),
        surname: data.surname?.trim(),
        number: data.number?.trim(),
        childAge: Number(data.childAge) || 12,
        childLanguage: data.childLanguage || Language.AZ,
        additionalInfo: isAdvice
          ? { kind: "advice" }
          : {
              kind: "course",
              courseId: data.courseId,
              courseTitle: selectedCourseTitle,
            },
      };

      await toast.promise(api.post("/requests", payload), {
        loading: t("sending"),
        success: () => {
          reset({ childAge: 12, childLanguage: Language.AZ, courseId: ADVICE_VALUE });
          setSuccess(true);
          return t("messageSent");
        },
        error: (err) => {
          if (axios.isAxiosError(err)) {
            const ax = err as AxiosError<any>;
            return ax.response?.data?.message || t("sendError");
          }
          return t("unexpectedError");
        },
        classNames: { icon: "text-jsyellow" },
      });
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(t("unexpectedError"));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <motion.div
            className="absolute inset-0 bg-jsblack/20"
            onClick={toggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 bg-white rounded-[32px] w-full max-w-md mx-auto p-6 flex flex-col items-center space-y-4"
            >
              <button
                className="self-end p-2 hover:bg-jsyellow/10 rounded-full"
                onClick={() => {
                  reset({ childAge: 12, childLanguage: Language.AZ, courseId: ADVICE_VALUE });
                  toggle();
                  setSuccess(false);
                }}
                type="button"
              >
                <MdClose className="text-xl" />
              </button>
              <h1 className="font-semibold text-2xl">{t("messageSent")}</h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="bg-green-100 rounded-full p-4"
              >
                <MdOutlineCheck className="text-green-600 text-4xl" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-[32px] w-full max-w-md mx-auto p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-semibold text-2xl">{t("title")}</h1>
                <button
                  className="p-2 hover:bg-jsyellow/10 rounded-full"
                  onClick={() => {
                    reset({ childAge: 12, childLanguage: Language.AZ, courseId: ADVICE_VALUE });
                    toggle();
                  }}
                  type="button"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              {/* Ad, Soyad, Telefon inputları */}
              {["name", "surname", "number"].map((field) => (
                <div key={field} className="space-y-2">
                  <input
                    type={field === "number" ? "tel" : "text"}
                    placeholder={t(`${field}.placeholder`)}
                    className="w-full min-h-[64px] text-base px-5 rounded-[32px] border border-jsyellow bg-[#fef7eb]
                      focus:outline-none focus:ring-2 focus:ring-jsyellow transition-all duration-300 shadow-sm"
                    {...register(field as keyof FormValues, {
                      required: t(`${field}.required`),
                      minLength:
                        field !== "number"
                          ? { value: 2, message: t(`${field}.minLength`) }
                          : undefined,
                      pattern:
                        field === "number"
                          ? {
                              value: /^(\+994|0)(50|51|55|70|77|99|10)\d{7}$/,
                              message: t("number.invalid"),
                            }
                          : undefined,
                    })}
                  />
                  {errors[field as keyof FormValues] && (
                    <p className="text-red-500 text-sm pl-2">
                      {(errors[field as keyof FormValues] as any)?.message}
                    </p>
                  )}
                </div>
              ))}

              <Select
                options={courseOptions}
                error={errors.courseId as any}
                placeholder={t("course.placeholder") ?? "Kurs seçin"}
                {...register("courseId", {
                  required: t("course.required") ?? "Kurs seçimi məcburidir",
                })}
                onChange={handleCourseChange}
              />

              <input type="hidden" {...register("childAge")} />
              <input type="hidden" {...register("childLanguage")} />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-jsyellow text-white font-semibold py-5 rounded-[32px] hover:bg-jsyellow/90 disabled:opacity-50 transition-all duration-300 shadow-md"
              >
                {isSubmitting ? t("sending") : t("submit")}
              </motion.button>
            </motion.form>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
 