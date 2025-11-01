import { getLocale, getTranslations } from "next-intl/server";
import ContactForm from "./contact-form";
import ContactInfo from "./contact-info";
import { getContact } from "@/utils/api/contact";
import { ContactData } from "@/types/contact";

export default async function ContactPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const contactData: ContactData = await getContact();

  return (
    <section className="container md:py-5 flex flex-col  w-full gap-12 items-center">
      <div className="w-full block md:hidden">
        <ContactInfo
          phone={contactData.phone}
          email={contactData.email}
          address={
            contactData.address[locale as keyof typeof contactData.address]
          }
          address2={
            contactData.address2[locale as keyof typeof contactData.address2]
          }
          whatsapp={contactData.whatsapp}
        />
      </div>
      <div className="space-y-6 w-full block md:hidden">
        <hr className="block md:hidden" style={{ border: 0, borderTop: "1px dashed black" }} />
        <h1 className="text-4xl md:text-5xl text-center font-bold text-jsblack leading-tight">
          {t("contact.title")}
        </h1>
        <p className="text-gray-600 text-center text-lg">{t("contact.description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-12">
        <div className="w-full">
          <ContactForm />
        </div>

        <div className="w-full hidden md:block">
          <ContactInfo
            phone={contactData.phone}
            email={contactData.email}
            address={
              contactData.address[locale as keyof typeof contactData.address]
            }
            address2={
              contactData.address2[locale as keyof typeof contactData.address2]
            }
            whatsapp={contactData.whatsapp}
          />
        </div>
      </div>
    </section>
  );
}
