import { Locale } from "@/i18n/request";
import { ContactData } from "@/types/contact";
import { getContact } from "@/utils/api/contact";
import { getTranslations } from "next-intl/server";
import ContactForm from "../contact-us/contact-form";
import ContactInfo from "../contact-us/contact-info";

export default async function GlossaryContact({
  language,
}: {
  language: string;
}) {
  const contactData: ContactData = await getContact();
  const locale = language as Locale;

  const glossaryT = await getTranslations({
    language,
    namespace: "glossary.term",
  });
  return (
    <div className="flex flex-col items-center gap-6 lg:gap-12">
      <p className="text-2xl font-bold max-w-2xl text-center whitespace-pre-line">
        {glossaryT("ctaDescription")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-12">
        <div className="w-full">
          <ContactForm />
        </div>

        <div className="w-full">
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
    </div>
  );
}
