"use client";
import { CourseModule } from "@/types/course";
import { useState } from "react";

interface CourseContentProps {
  modules: CourseModule[];
  locale: "az" | "ru";
  title: string;
}

export default function CourseContent({
  modules,
  locale,
}: CourseContentProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);
 
  return (
    <div className="w-full  lg:h-[500px]  max-w-3xl mx-auto  sm:py-8 md:py-2 ">
      <div className="space-y-3 flex flex-col  ">
        {modules.map((module, index) => (
          <div
            key={index}
            className="border  border-jsyellow rounded-[24px] md:rounded-[32px] overflow-hidden bg-white"
          >
            <button
              className="w-full p-4 md:p-5 flex justify-between  items-center bg-[#fef7eb] text-left"
              onClick={() => setOpenModule(openModule === index ? null : index)}
            >
              <div className="flex items-center ">
                <div className="w-6 h-6 bg-jsyellow text-white flex items-center justify-center mr-3 md:mr-4 rounded-full text-base md:text-lg">
                  {index + 1}
                </div>
                <span className="font-semibold text-sm md:text-base
      [@media(min-width:2500px)]:!text-3xl
                
                ">
                  {module.module.title[locale]}
                </span>
              </div>
              <span
                className={`transform transition-transform duration-200 ${
                  openModule === index ? "rotate-180" : "rotate-0"
                }`}
              >
                ↓
              </span>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openModule === index ? "max-h-80 md:max-h-[450px]" : "max-h-0"
              }`}
            >
              <div className="pb-5 px-4 md:pb-6 md:px-6 bg-white">
                <ul className="list-disc list-inside p-4 space-y-2 [@media(min-width:3500px)]:text-2xl text-sm md:text-base">
                  {module.module.content.map((item, idx) => (
                    <li className="[@media(min-width:3500px)]:!text-3xl" key={idx}>{item[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
