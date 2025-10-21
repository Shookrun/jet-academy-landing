"use client";

import { useEffect, useMemo, useState } from "react";
import { Locale } from "@/i18n/request";
import { Language, RequestFormInputs } from "@/types/request";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import api from "@/utils/api/axios";
import Select from "@/components/ui/select";
import { MdClose, MdOutlineCheck } from "react-icons/md";

type CourseItem = { id: string; title?: Record<string, string> };

const ADVICE_VALUE = "__advice__";

const ContactFormForBlog = () => {
  const t = useTranslations("contact.form");
  const locale = useLocale() as Locale;

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
  } = useForm<RequestFormInputs>({
    defaultValues: {
      // UI-də göstərməsək də backend tələb edir
      childAge: 12,
      childLanguage: Language.AZ,
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

        const withAdvice = [{ value: ADVICE_VALUE, label: "Məsləhət almaq istəyirəm" }, ...opts];
        if (active) setCourseOptions(withAdvice);
      } catch (e) {
        console.error("Kurs siyahısı alınmadı:", e);
        if (active) setCourseOptions([{ value: ADVICE_VALUE, label: "Məsləhət almaq istəyirəm" }]);
      }
    })();
    return () => {
      active = false;
    };
  }, [locale]);

  const selectedCourseTitle = useMemo(() => {
    const hit = courseOptions.find((o) => o.value === selectedCourseId);
    return hit?.label;
  }, [courseOptions, selectedCourseId]);

  const onSubmit: SubmitHandler<RequestFormInputs> = async (data) => {
    try {
      const isAdvice = !data.courseId || data.courseId === ADVICE_VALUE;

      const payload = {
        name: data.name?.trim(),
        surname: data.surname?.trim(),
        number: data.number?.trim(),

        // Backend DTO məcburilər:
        childAge: Number(data.childAge) || 12,
        childLanguage: data.childLanguage || Language.AZ,

        // Kurs seçiminə dair info: JSON-a düşür
        additionalInfo: isAdvice
          ? { kind: "advice" }
          : {
              kind: "course",
              courseId: data.courseId,
              courseTitle: selectedCourseTitle,
            },
      };

      await api.post("/requests", payload);
      reset({ childAge: 12, childLanguage: Language.AZ, courseId: ADVICE_VALUE });
      setSuccess(true);
    } catch (err) {
      console.error("Error sending message:", err);
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<any>;
        toast.error(error.response?.data?.message || t("sendError"));
      } else {
        toast.error(t("unexpectedError"));
      }
    }
  };

  const handleCourseChange = (value: string | number) => {
    setValue("courseId", String(value), { shouldValidate: true });
  };

  return (
    <div className="relative border border-jsyellow p-4 py-6 rounded-[32px] pb-8">
      <motion.form
        className="space-y-6 w-full"
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold">{t("contactTitle")}</h2>

        {/* Ad */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder={t("name.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] focus:outline-none focus:ring-2 focus:ring-jsyellow shadow-sm transition-all"
            {...register("name", {
              required: t("name.required"),
              minLength: { value: 2, message: t("name.minLength") },
            })}
          />
          {errors.name && <p className="text-red-500 text-sm pl-2">{errors.name.message}</p>}
        </div>

        {/* Soyad */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder={t("surname.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] focus:outline-none focus:ring-2 focus:ring-jsyellow shadow-sm transition-all"
            {...register("surname", {
              required: t("surname.required"),
              minLength: { value: 2, message: t("surname.minLength") },
            })}
          />
          {errors.surname && <p className="text-red-500 text-sm pl-2">{errors.surname.message}</p>}
        </div>

        {/* Telefon */}
        <div className="space-y-2">
          <input
            type="tel"
            placeholder={t("number.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] focus:outline-none focus:ring-2 focus:ring-jsyellow shadow-sm transition-all"
            {...register("number", {
              required: t("number.required"),
              pattern: {
                value: /^(\+994|0)(50|51|55|70|77|99|10)\d{7}$/,
                message: t("number.invalid"),
              },
            })}
          />
          {errors.number && <p className="text-red-500 text-sm pl-2">{errors.number.message}</p>}
        </div>

        {/* Kurs seçimi — siyahının ilkində “Məsləhət almaq istəyirəm” */}
        <Select
          label={t("course.label") ?? "Kurs seçimi"}
          options={courseOptions}
          error={errors.courseId as any}
          placeholder={t("course.placeholder") ?? "Kurs seçin"}
          {...register("courseId", {
            required: t("course.required") ?? "Kurs seçimi məcburidir",
          })}
          onChange={handleCourseChange}
        />

        {/* Gizli sahələr: backend tələbi olduğuna görə */}
        <input type="hidden" {...register("childAge")} />
        <input type="hidden" {...register("childLanguage")} />

        {/* Göndər düyməsi */}
        <motion.button
          type="submit"
          className="w-full bg-jsyellow text-white font-semibold py-4 px-8 rounded-[32px] hover:bg-jsyellow/90 disabled:opacity-50 transition-all shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("sending") : t("submit")}
        </motion.button>
      </motion.form>

      {/* Uğur modalı */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccess(false)}
          >
            <motion.div
              className="bg-white rounded-[32px] p-6 w-full max-w-[500px] mx-4 space-y-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 hover:bg-jsyellow/10 p-2 rounded-full"
                onClick={() => setSuccess(false)}
              >
                <MdClose className="text-xl" />
              </motion.button>
              <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <h1 className="font-semibold text-lg text-jsblack text-center">{t("messageSent")}</h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  className="bg-green-100 rounded-full p-3"
                >
                  <MdOutlineCheck className="text-green-600 text-3xl" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactFormForBlog;
