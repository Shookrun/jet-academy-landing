"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlinePhone } from "react-icons/hi2";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import Logo from "./logo";
import NavLink from "./nav-link";
import Button from "@/components/ui/button";
import LanguageSwitcher from "@/components/shared/language-switcher";
import { useContactModal } from "@/hooks/useContactModal";
import { getNavLinks } from "@/data/navlinks";
import { usePathname } from "@/i18n/routing";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggle } = useContactModal();
  const t = useTranslations("navbar");
  const navLinks = getNavLinks(t);
  const path = usePathname();

  useEffect(() => {
    document.body.style.overflowY = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header
      className="
        transition-all relative z-[999]
        pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14 2xl:pt-16 4xl:pt-20
        duration-300

      "
    >
      <nav
        className="
        container  flex justify-between items-center
                [@media(min-width:2500px)]:!max-w-[2200px]
                [@media(min-width:3500px)]:!max-w-full
                [@media(min-width:3500px)]:!px-52
        "
      >
        <Link href="/" className="relative z-50 p-0 mb-[3px] shrink-0">
 <Logo
  className="
    w-44 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-44 4xl:w-52
    aspect-[3/1]
  "
/>

</Link>

        <div className="hidden lg:flex  items-center gap-6 xl:gap-8 2xl:gap-10 4xl:gap-12">
          <menu className="flex flex-nowrap whitespace-nowrap gap-4 md:gap-6 lg:gap-8 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                isActive={path === link.href}
                {...link}
                handleClick={() => setIsMenuOpen(false)}
                className="py-1 md:py-2 whitespace-nowrap text-base md:text-md lg:text-md [@media(min-width:2500px)]:!text-2xl"
              />
            ))}
          </menu>

          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSwitcher />
            <Button
              onClick={() => {
                setIsMenuOpen(false);
                toggle();
              }}
              icon={<HiOutlinePhone size={20} />}
              className="font-medium text-sm [@media(min-width:2500px)]:!text-2xl md:text-base h-10 md:h-12 px-4 md:px-6 bg-jsyellow hover:bg-[#00A300] text-white hover:text-white"
              text={t("contactus")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden relative z-50">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen((o) => !o)}
            className="p-2 md:p-3 text-jsblack hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                  <div className="flex justify-end items-center p-4 border-b border-gray-200">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <HiX size={24} />
                    </button>
                  </div>

                  <div className="px-4 py-6 flex flex-col gap-3 md:gap-4">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.title}
                        {...link}
                        handleClick={() => setIsMenuOpen(false)}
                        className="text-lg md:text-xl py-3 border-b border-gray-100 cursor-pointer whitespace-nowrap"
                      />
                    ))}
                  </div>

                  <div className="px-4 pb-6">
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        toggle();
                      }}
                      icon={<HiOutlinePhone size={22} />}
                      className="font-medium w-full text-base md:text-lg h-12 bg-jsyellow text-white hover:bg-[#00A300]"
                      text={t("contactus")}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
