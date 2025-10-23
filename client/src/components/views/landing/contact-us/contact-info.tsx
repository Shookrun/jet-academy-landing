"use client";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { MdPhone, MdMail, MdLocationOn } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

interface ContactInfoProps {
  phone: string;
  email: string;
  address: string;
  address2: string;
  whatsapp: string;
}

export default function ContactInfo({
  phone,
  email,
  address,
  address2,
  whatsapp,
}: ContactInfoProps) {
  const t = useTranslations();
  const locale = useLocale();


  const addressGText = {
    az: "Bakı ş., Olimpiya küçəsi 6A (Gənclik metro stansiyası, İdman Nazirliyi yaxınlığında)",
    ru: "Баку, ул. Олимпия 6А (около станции метро Гянджлик, рядом с Министерством Спорта)",
    default: address,
  };


  const contactItems = [
    {
      icon: <MdPhone className="w-6 h-6 text-jsyellow" />,
      title: t("contact.info.phone"),
      value: phone,
      link: `tel:${phone}`,
    },
    {
      icon: <FaWhatsapp className="w-6 h-6 text-jsyellow" />,
      title: t("contact.info.whatsapp"),
      value: whatsapp,
      link: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
    {
      icon: <MdMail className="w-6 h-6 text-jsyellow" />,
      title: t("contact.info.email"),
      value: email,
      link: `mailto:${email}`,
    },
    {
      icon: <MdLocationOn className="w-6 h-6 text-jsyellow" />,
      title: t("contact.info.addressg"),
      value: addressGText[locale as "az" | "ru"] || addressGText.default,
      link: `https://maps.google.com/?q=${encodeURIComponent(
        "JET Academy Genclik"
      )}`,
    },
      ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {contactItems.map((item, index) => (
        <motion.a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-jsyellow rounded-[32px] px-6 py-4 bg-[#fef7eb] hover:scale-[1.02] transition-transform"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-4">
            {item.icon}
            <div>
              <h3 className="font-semibold text-xl text-jsblack mb-1">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.value}</p>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
