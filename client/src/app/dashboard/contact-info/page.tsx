"use client";
import api from "@/utils/api/axios";
import { Button, Card, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import { MdAccessTime, MdLocationOn, MdMail, MdPhone } from "react-icons/md";
import { toast } from "sonner";

interface ContactFormInputs {
  id?: string;
  email: string;
  address: {
    az: string;
    ru: string;
  };
  address2: {
    az: string;
    ru: string;
  };
  whatsapp: string;
  phone: string;
  workingHours: {
    az: {
      weekdays: string;
      sunday: string;
    };
    ru: {
      weekdays: string;
      sunday: string;
    };
  };
}

export default function EditContactPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contactId, setContactId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>();

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data } = await api.get("/contact");
        const contactData = Array.isArray(data) ? data[0] : data;
        setContactId(contactData.id);
        reset(contactData);
      } catch (error) {
        console.error("Error fetching contact info:", error);
        toast.error("Əlaqə məlumatları yüklənmədi");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, [reset, router]);

  const onSubmit = async (data: ContactFormInputs) => {
    const { ...rest } = data;

    try {
      const response = await api.patch("/contact/" + contactId, rest);

      if (response.status === 200) {
        toast.success("Əlaqə məlumatları yeniləndi");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Xəta baş verdi. Yenidən cəhd edin"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen w-full flex items-center justify-center">
        <p>Yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="w-full max-w-2xl p-6 bg-white shadow-lg mx-auto">
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <MdLocationOn size={48} className="text-jsyellow" />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Əlaqə Məlumatlarını Yenilə
            </motion.h1>
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
                type="text"
                label="Ünvan 1 (AZ)"
                variant="bordered"
                startContent={<MdLocationOn className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("address.az", { required: "Ünvan tələb olunur" })}
                isInvalid={!!errors.address?.az}
                errorMessage={errors.address?.az?.message}
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
                type="text"
                label="Адрес 1 (RU)"
                variant="bordered"
                startContent={<MdLocationOn className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("address.ru", { required: "Адрес обязателен" })}
                isInvalid={!!errors.address?.ru}
                errorMessage={errors.address?.ru?.message}
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
                type="text"
                label="Ünvan 2 (AZ)"
                variant="bordered"
                startContent={<MdLocationOn className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("address2.az", { required: "Ünvan tələb olunur" })}
                isInvalid={!!errors.address2?.az}
                errorMessage={errors.address2?.az?.message}
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
                type="text"
                label="Адрес 2 (RU)"
                variant="bordered"
                startContent={<MdLocationOn className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("address2.ru", { required: "Адрес обязателен" })}
                isInvalid={!!errors.address2?.ru}
                errorMessage={errors.address2?.ru?.message}
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
                type="tel"
                label="WhatsApp"
                variant="bordered"
                startContent={<FaWhatsapp className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("whatsapp", {
                  required: "WhatsApp nömrəsi tələb olunur",
                })}
                isInvalid={!!errors.whatsapp}
                errorMessage={errors.whatsapp?.message}
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
                type="tel"
                label="Telefon"
                variant="bordered"
                startContent={<MdPhone className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("phone", {
                  required: "Telefon nömrəsi tələb olunur",
                })}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
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
                type="text"
                label="İş saatları - Həftəiçi (AZ)"
                variant="bordered"
                startContent={<MdAccessTime className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("workingHours.az.weekdays", {
                  required: "İş saatları tələb olunur",
                })}
                isInvalid={!!errors.workingHours?.az?.weekdays}
                errorMessage={errors.workingHours?.az?.weekdays?.message}
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
                type="text"
                label="Рабочие часы - Будни (RU)"
                variant="bordered"
                startContent={<MdAccessTime className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("workingHours.ru.weekdays", {
                  required: "Рабочие часы обязательны",
                })}
                isInvalid={!!errors.workingHours?.ru?.weekdays}
                errorMessage={errors.workingHours?.ru?.weekdays?.message}
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
                type="text"
                label="İş saatları - Bazar (AZ)"
                variant="bordered"
                startContent={<MdAccessTime className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("workingHours.az.sunday", {
                  required: "İş saatları tələb olunur",
                })}
                isInvalid={!!errors.workingHours?.az?.sunday}
                errorMessage={errors.workingHours?.az?.sunday?.message}
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
                type="text"
                label="Рабочие часы - Воскресенье (RU)"
                variant="bordered"
                startContent={<MdAccessTime className="text-gray-400" />}
                isDisabled={isSubmitting}
                {...register("workingHours.ru.sunday", {
                  required: "Рабочие часы обязательны",
                })}
                isInvalid={!!errors.workingHours?.ru?.sunday}
                errorMessage={errors.workingHours?.ru?.sunday?.message}
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: [
                    "bg-white border-2 hover:border-jsyellow focus:border-jsyellow",
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
                {isSubmitting ? "Yenilənir..." : "Yenilə"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
