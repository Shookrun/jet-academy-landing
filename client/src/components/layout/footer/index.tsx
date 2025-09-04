// src/components/shared/footer.tsx
import { ContactData } from "@/types/contact";
import { getContact } from "@/utils/api/contact";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import {
  FaClock,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import api from "@/utils/api/axios";

interface Course {
  id: string;
  title: { az: string; ru: string };
  slug: { az: string; ru: string };
  createdAt: string;
}
interface CoursesResponse {
  items?: Course[];
}

const fetchCourses = async (): Promise<CoursesResponse | Course[] | null> => {
  try {
    const { data } = await api.get("/courses");
    return data;
  } catch {
    console.error("Failed to fetch courses");
    return null;
  }
};

export default async function Footer() {
  try {
    const t = await getTranslations("footer");
    const localeRaw = await getLocale();
    const lang = (localeRaw === "ru" ? "ru" : "az") as "az" | "ru";
    const contact: ContactData = await getContact();
    const coursesData = await fetchCourses();
    const currentYear = new Date().getFullYear();

    const sortedCourses: Course[] = Array.isArray(coursesData)
      ? coursesData.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : coursesData?.items
      ? coursesData.items.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : [];

    return (
      <footer id="contacts" className="bg-jsyellow w-full text-white mt-12 sm:mt-16 md:mt-20">
        <div className="absolute inset-y-0 right-0 z-0 mix-blend-soft-light opacity-30 sm:opacity-40 lg:opacity-50 blur-[1px] sm:blur-[2px]">
          <div className="absolute top-[5%] sm:top-[10%] right-2 sm:right-0 md:-left-[5%]">
            <Image 
              src="/hero/rocket.png" 
              alt="" 
              width={300} 
              height={300} 
              className="w-[120px] sm:w-[150px] md:w-[200px] lg:w-[300px] [@media(min-width:3500px)]:!w-[400px]" 
            />
          </div>
          <div className="absolute top-1/2 right-2 sm:right-0 md:-right-[5%]">
            <Image 
              src="/hero/book.png" 
              alt="" 
              width={300} 
              height={300} 
              className="w-[120px] sm:w-[150px] md:w-[200px] lg:w-[300px] [@media(min-width:3500px)]:!w-[400px]" 
            />
          </div>
          <div className="hidden md:block absolute bottom-4 left-[15%] lg:left-[20%] opacity-50 sm:opacity-70 blur-[1px] sm:blur-[2px]">
            <Image 
              src="/hero/laptop.png" 
              alt="" 
              width={300} 
              height={300} 
              className="w-[150px] md:w-[200px] lg:w-[300px] [@media(min-width:3500px)]:!w-[400px]" 
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 [@media(min-width:3000px)]:px-24 [@media(min-width:3500px)]:px-32 relative z-10 py-6 sm:py-8 md:py-12 lg:py-16">
          
          <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-10 lg:gap-12 [@media(min-width:2500px)]:gap-16 [@media(min-width:3500px)]:gap-24">
            {/* Left Section - Company Info */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 [@media(min-width:2500px)]:gap-8 [@media(min-width:3500px)]:gap-10 flex-1 min-w-[280px] max-w-[500px] [@media(min-width:2500px)]:max-w-[600px] [@media(min-width:3500px)]:max-w-[800px]">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl [@media(min-width:2500px)]:!text-5xl [@media(min-width:3500px)]:!text-6xl font-bold">
                JET School
              </h2>
              <p className="max-w-xs sm:max-w-sm lg:max-w-md [@media(min-width:2500px)]:max-w-lg [@media(min-width:3500px)]:max-w-xl text-white/80 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl leading-relaxed [@media(min-width:3500px)]:leading-relaxed">
                {t("tagline")}
              </p>

              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 [@media(min-width:2500px)]:gap-6 [@media(min-width:3500px)]:gap-8">
                <Link
                  href={`https://maps.google.com?q=${encodeURIComponent(contact.address[lang])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200"
                >
                  <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed [@media(min-width:3500px)]:leading-relaxed">{contact.address[lang]}</span>
                </Link>
                
                <Link
                  href={`https://maps.google.com?q=${encodeURIComponent(contact.address2[lang])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200"
                >
                  <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed [@media(min-width:3500px)]:leading-relaxed">{contact.address2[lang]}</span>
                </Link>

                <div className="flex flex-col gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6">
                  <Link
                    href={`tel:${contact.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200"
                  >
                    <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </Link>
                  
                  <Link
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200"
                  >
                    <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 flex-shrink-0" />
                    <span>{contact.whatsapp}</span>
                  </Link>
                  
                  <Link
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200"
                  >
                    <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 flex-shrink-0" />
                    <span>{contact.email}</span>
                  </Link>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 [@media(min-width:2500px)]:gap-4 [@media(min-width:3500px)]:gap-6 text-sm sm:text-base">
                  <FaClock className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-6 [@media(min-width:2500px)]:!h-6 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8 mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1 [@media(min-width:2500px)]:gap-2">
                    <span className="[@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl leading-relaxed [@media(min-width:3500px)]:leading-relaxed">
                      {contact.workingHours[lang].weekdays}
                    </span>
                    <span className="[@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl leading-relaxed [@media(min-width:3500px)]:leading-relaxed">
                      {contact.workingHours[lang].sunday}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 [@media(min-width:2500px)]:gap-6 [@media(min-width:3500px)]:gap-8 pt-2 sm:pt-4 [@media(min-width:2500px)]:pt-6">
                  <Link 
                    href="https://facebook.com/jetschool.az" 
                    target="_blank" 
                    className="w-8 h-8 sm:w-10 sm:h-10 [@media(min-width:2500px)]:!w-14 [@media(min-width:2500px)]:!h-14 [@media(min-width:3500px)]:!w-16 [@media(min-width:3500px)]:!h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-7 [@media(min-width:2500px)]:!h-7 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />
                  </Link>
                  <Link 
                    href="https://instagram.com/jet.school.baku" 
                    target="_blank" 
                    className="w-8 h-8 sm:w-10 sm:h-10 [@media(min-width:2500px)]:!w-14 [@media(min-width:2500px)]:!h-14 [@media(min-width:3500px)]:!w-16 [@media(min-width:3500px)]:!h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-7 [@media(min-width:2500px)]:!h-7 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />
                  </Link>
                  <Link 
                    href="https://youtube.com/@jetschoolbaku" 
                    target="_blank" 
                    className="w-8 h-8 sm:w-10 sm:h-10 [@media(min-width:2500px)]:!w-14 [@media(min-width:2500px)]:!h-14 [@media(min-width:3500px)]:!w-16 [@media(min-width:3500px)]:!h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-7 [@media(min-width:2500px)]:!h-7 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />
                  </Link>
                  <Link 
                    href="https://tiktok.com/@jetschoolbaku" 
                    target="_blank" 
                    className="w-8 h-8 sm:w-10 sm:h-10 [@media(min-width:2500px)]:!w-14 [@media(min-width:2500px)]:!h-14 [@media(min-width:3500px)]:!w-16 [@media(min-width:3500px)]:!h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    <FaTiktok className="w-4 h-4 sm:w-5 sm:h-5 [@media(min-width:2500px)]:!w-7 [@media(min-width:2500px)]:!h-7 [@media(min-width:3500px)]:!w-8 [@media(min-width:3500px)]:!h-8" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-row gap-12 sm:gap-8 lg:gap-12 xl:gap-16 [@media(min-width:2500px)]:gap-20 [@media(min-width:3500px)]:gap-28 flex-1 min-w-[300px]">
              
              {/* Explore Section */}
              <div className="flex-1 min-w-[160px] max-w-[220px] [@media(min-width:2500px)]:max-w-[300px] [@media(min-width:3500px)]:max-w-[400px]">
                <h3 className="text-lg sm:text-xl lg:text-2xl [@media(min-width:2500px)]:!text-3xl [@media(min-width:3500px)]:!text-5xl font-bold mb-4 sm:mb-5 [@media(min-width:2500px)]:mb-6 [@media(min-width:3500px)]:mb-8">
                  {t("explore")}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4 [@media(min-width:2500px)]:gap-5 [@media(min-width:3500px)]:gap-6">
                  <li>
                    <Link 
                      href="/" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("home")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about-us" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("about")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/gallery" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("gallery")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/blog" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("blog")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Courses Section */}
              <div className="flex-1 min-w-[180px] max-w-[320px] [@media(min-width:2500px)]:max-w-[450px] [@media(min-width:3500px)]:max-w-[600px]">
                <h3 className="text-lg sm:text-xl lg:text-2xl [@media(min-width:2500px)]:!text-3xl [@media(min-width:3500px)]:!text-5xl font-bold mb-4 sm:mb-5 [@media(min-width:2500px)]:mb-6 [@media(min-width:3500px)]:mb-8">
                  {t("courses")}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4 [@media(min-width:2500px)]:gap-5 [@media(min-width:3500px)]:gap-6">
                  {sortedCourses.length > 0 ? (
                    sortedCourses.map((c) => (
                      <li key={c.id}>
                        <Link 
                          href={`/course/${c.slug[lang]}`} 
                          className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed block"
                        >
                          {c.title[lang]}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl text-white/70">
                      {t("noCourses")}
                    </li>
                  )}
                </ul>
              </div>

              {/* Resources Section */}
              <div className="flex-1 min-w-[160px] max-w-[220px] [@media(min-width:2500px)]:max-w-[300px] [@media(min-width:3500px)]:max-w-[400px]">
                <h3 className="text-lg sm:text-xl lg:text-2xl [@media(min-width:2500px)]:!text-3xl [@media(min-width:3500px)]:!text-5xl font-bold mb-4 sm:mb-5 [@media(min-width:2500px)]:mb-6 [@media(min-width:3500px)]:mb-8">
                  {t("resources")}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4 [@media(min-width:2500px)]:gap-5 [@media(min-width:3500px)]:gap-6">
                  <li>
                    <Link 
                      href="/glossary" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("glossary")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/news" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("news")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/projects" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("projects")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/contact-us" 
                      className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl hover:underline transition-all duration-200 hover:text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 sm:mt-10 lg:mt-12 [@media(min-width:2500px)]:mt-16 [@media(min-width:3500px)]:mt-20 pt-6 sm:pt-8 [@media(min-width:2500px)]:pt-10 [@media(min-width:3500px)]:pt-12 border-t border-white/20 text-center lg:text-left">
            <p className="text-sm sm:text-base [@media(min-width:2500px)]:!text-xl [@media(min-width:3500px)]:!text-3xl text-white/90 leading-relaxed [@media(min-width:3500px)]:leading-relaxed">
              © {currentYear} JET School. {t("copyright")}
            </p>
          </div>
        </div>
      </footer>
    );
  } catch (err) {
    console.error("Footer error:", err);
    return (
      <footer className="bg-jsyellow w-full text-white py-6 text-center">
        <p className="text-sm sm:text-base [@media(min-width:3500px)]:!text-2xl">
          © {new Date().getFullYear()} JET School
        </p>
      </footer>
    );
  }
}