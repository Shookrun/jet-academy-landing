"use client";
import { useContactModal } from "@/hooks/useContactModal";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose, MdOutlineCheck } from "react-icons/md";
import { RequestFormInputs, Language } from "@/types/request";
import axios from "axios";
import api from "@/utils/api/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Select from "../ui/select";

export default function ContactModal() {
  const t = useTranslations("contact.form");
  const { isOpen, toggle } = useContactModal();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RequestFormInputs>();

  const ageOptions = Array.from({ length: 9 }, (_, i) => ({
    value: i + 9,
    label: `${i + 9}`,
  }));
  const languageOptions = [
    { value: Language.AZ, label: t("childLanguage.options.az") },
    { value: Language.RU, label: t("childLanguage.options.ru") },
  ];

  const onSubmit = handleSubmit((data) =>
    toast.promise(api.post("/requests", data), {
      loading: t("sending"),
      success: () => {
        reset();
        setSuccess(true);
        return t("messageSent");
      },
      error: (err) => {
        if (axios.isAxiosError(err) && err.response) {
          return err.response.data.message || t("sendError");
        }
        return t("unexpectedError");
      },
      classNames: { icon: "text-jsyellow" },
    })
  );

  const handleAgeChange = (value: string | number) => {
    setValue("childAge", Number(value));
  };
  const handleLanguageChange = (value: string | number) => {
    setValue("childLanguage", value as Language);
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
              className="
                relative z-10 bg-white rounded-[32px]
                w-full max-w-sm sm:max-w-md md:max-w-lg
                mx-auto p-6
                flex flex-col items-center space-y-4
              "
            >
              <button
                className="self-end p-2 hover:bg-jsyellow/10 rounded-full"
                onClick={() => {
                  reset();
                  toggle();
                  setSuccess(false);
                }}
                type="button"
              >
                <MdClose className="text-xl" />
              </button>
              <h1 className="font-semibold text-2xl">
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
                className="bg-green-100 rounded-full p-4"
              >
                <MdOutlineCheck className="text-green-600 text-4xl" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="
                relative bg-white rounded-[32px]
                w-full max-w-sm sm:max-w-md md:max-w-lg
                mx-auto p-6
                space-y-4
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-semibold text-2xl">
                  {t("title")}
                </h1>
                <button
                  className="p-2 hover:bg-jsyellow/10 rounded-full"
                  onClick={() => {
                    reset();
                    toggle();
                  }}
                  type="button"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t("name.placeholder")}
                  className="
                    w-full p-6 rounded-[32px] border border-jsyellow bg-[#fef7eb]
                    focus:outline-none focus:ring-2 focus:ring-jsyellow
                    transition-shadow duration-300
                  "
                  {...register("name", {
                    required: t("name.required"),
                    minLength: { value: 2, message: t("name.minLength") },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-base pl-2">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder={t("surname.placeholder")}
                  className="
                    w-full p-6 rounded-[32px] border border-jsyellow bg-[#fef7eb]
                    focus:outline-none focus:ring-2 focus:ring-jsyellow
                    transition-shadow duration-300
                  "
                  {...register("surname", {
                    required: t("surname.required"),
                    minLength: { value: 2, message: t("surname.minLength") },
                  })}
                />
                {errors.surname && (
                  <p className="text-red-500 text-base pl-2">
                    {errors.surname.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder={t("number.placeholder")}
                  className="
                    w-full p-6 rounded-[32px] border border-jsyellow bg-[#fef7eb]
                    focus:outline-none focus:ring-2 focus:ring-jsyellow
                    transition-shadow duration-300
                  "
                  {...register("number", {
                    required: t("number.required"),
                    pattern: {
                      value: /^(\+994|0)(50|51|55|70|77|99|10)\d{7}$/,
                      message: t("number.invalid"),
                    },
                  })}
                />
                {errors.number && (
                  <p className="text-red-500 text-base pl-2">
                    {errors.number.message}
                  </p>
                )}
              </div>

              <Select
                label={t("childAge.label")}
                description={t("childAge.description")}
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
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="
                  w-full bg-jsyellow text-white font-semibold py-5
                  rounded-[32px] hover:bg-jsyellow/90
                  disabled:opacity-50 transition-all duration-300 shadow-md
                "
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