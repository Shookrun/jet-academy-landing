"use client";
import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const newPath = path.slice(path.indexOf("/", 1));
  const router = useRouter();

  const handleSelect = (code: string) => {
    setIsOpen(false);
    router.replace(`/` + code + (path.length > 4 ? newPath : ""));
    router.refresh();
  };
  const locales = ["az", "en"];
  return (
    <div
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      className={cn(
        "border relative flex bg-white [@media(min-width:3500px)]:!text-2xl justify-between gap-2 text-sm h-11 transition-all cursor-pointer font-semibold text-jsblack items-center border-gray-300 px-4 py-2 rounded-[30px]",
        !isOpen ? "hover:bg-jsblack/10" : "bg-jsblack/10",
        className
      )}
    >
     {
      locale == "az" ?  <Image
    src="/flags/az.png"
    alt="Azerbaijan flag"
 
    width={25}
    height={30}
    quality={100}
    className="[@media(min-width:3500px)]:!w-[40px]"
  /> :
   <Image
    src="/flags/rus.png"
    alt="Azerbaijan flag"
 
    width={25}
    height={30}
    quality={100}
    className="[@media(min-width:3500px)]:!w-[40px]"

  />
     }
      {locale.toUpperCase()}
      <HiChevronDown />

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="flex flex-col max-w-[150px] items-center justify-center inset-0 top-full mt-2 h-fit absolute bg-white border border-gray-300 rounded-[16px] overflow-hidden"
          >
            {locales.map((code) => (
              <div
                key={code}
                onClick={() => handleSelect(code)}
                className="hover:bg-jsblack/10 py-1 w-full text-center flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                {
                  code == "az" ?  <Image
    src="/flags/az.png"
    alt="Azerbaijan flag"
 
    width={30}
    height={30}
    quality={100}
    className="[@media(min-width:3500px)]:!w-[40px]"

  /> :
   <Image
    src="/flags/rus.png"
    alt="Azerbaijan flag"
 
    width={25}
    height={30}
    quality={100}
    className="[@media(min-width:3500px)]:!w-[40px]"

  />
                }
                {code.toUpperCase()}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
