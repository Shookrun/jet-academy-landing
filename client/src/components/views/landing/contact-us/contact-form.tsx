"use client";

import { useState } from "react";
import { Language, RequestFormInputs } from "@/types/request";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import api from "@/utils/api/axios";
import Select from "@/components/ui/select";
import { MdClose, MdOutlineCheck } from "react-icons/md";

const ageOptions = Array.from({ length: 30 }, (_, i) => ({
  value: i + 17,
  label: `${i + 17}`,
}));

const ContactForm = () => {
  const t = useTranslations("contact.form");
  const [success, setSuccess] = useState(false);

  const languageOptions = [
    { value: Language.AZ, label: t("childLanguage.options.az") },
    { value: Language.RU, label: t("childLanguage.options.ru") },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RequestFormInputs>();

const onSubmit: SubmitHandler<RequestFormInputs> = async (data) => {
  try {
    await api.post("/requests", data);
    reset();
    setSuccess(true);
  } catch (err) {
    console.error("Error sending message:", err);
    if (axios.isAxiosError(err)) {
      const error = err as AxiosError<any>;
      toast.error(error.response?.data.message || t("sendError"));
    } else {
      toast.error(t("unexpectedError"));
    }
  }
};


  const handleAgeChange = (value: string | number) => {
    setValue("childAge", Number(value));
  };

  const handleLanguageChange = (value: string | number) => {
    setValue("childLanguage", value as Language);
  };

  return (
    <div className="relative">
      <motion.form
        className="space-y-6 w-full"
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="space-y-2">
          <input
            type="text"
            placeholder={t("name.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] 
              focus:outline-none focus:ring-2 focus:ring-jsyellow 
              shadow-sm transition-all duration-300 ease-in-out"
            {...register("name", {
              required: t("name.required"),
              minLength: {
                value: 2,
                message: t("name.minLength"),
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm pl-2">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder={t("surname.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] 
              focus:outline-none focus:ring-2 focus:ring-jsyellow 
              shadow-sm transition-all duration-300 ease-in-out"
            {...register("surname", {
              required: t("surname.required"),
              minLength: {
                value: 2,
                message: t("surname.minLength"),
              },
            })}
          />
          {errors.surname && (
            <p className="text-red-500 text-sm pl-2">
              {errors.surname.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <input
            type="tel"
            placeholder={t("number.placeholder")}
            className="w-full p-4 rounded-[32px] border border-jsyellow bg-[#fef7eb] 
              focus:outline-none focus:ring-2 focus:ring-jsyellow 
              shadow-sm transition-all duration-300 ease-in-out"
            {...register("number", {
              required: t("number.required"),
              pattern: {
                value: /^(\+994|0)(50|51|55|70|77|99|10)\d{7}$/,
                message: t("number.invalid"),
              },
            })}
          />
          {errors.number && (
            <p className="text-red-500 text-sm pl-2">
              {errors.number.message}
            </p>
          )}
        </div>

        <Select
          label={t("childAge.label")}
          options={ageOptions}
          error={errors.childAge}
          placeholder={t("childAge.placeholder")}
          {...register("childAge", {
            required: t("childAge.required"),
          })}
          onChange={handleAgeChange}
        />

        <Select
          label={t("childLanguage.label")}
          options={languageOptions}
          error={errors.childLanguage}
          placeholder={t("childLanguage.placeholder")}
          {...register("childLanguage", {
            required: t("childLanguage.required"),
          })}
          onChange={handleLanguageChange}
        />

        <motion.button
          type="submit"
          className="w-full bg-jsyellow text-white font-semibold py-4 px-8 
            rounded-[32px] hover:bg-jsyellow/90 disabled:opacity-50 
            transition-all duration-300 ease-in-out shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("sending") : t("submit")}
        </motion.button>
      </motion.form>

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
                <h1 className="font-semibold text-lg text-jsblack text-center">
                  {t("messageSent")}
                </h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                  }}
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

export default ContactForm;
