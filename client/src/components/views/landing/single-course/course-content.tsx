"use client";
import { CourseModule } from "@/types/course";
import { useState } from "react";

interface CourseContentProps {
  modules: CourseModule[];
  locale: "az" | "en";
  title?: string;
}

export default function CourseContent({ modules, locale }: CourseContentProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto sm:py-8 md:py-2">
      <div className="flex flex-col space-y-4">
        {modules.map((module, index) => {
          const isOpen = openModule === index;
          const moduleTitle =
            (module as any)?.module?.title?.[locale] ??
            (module as any)?.module?.title?.az ??
            (module as any)?.module?.title?.en ??
            `Module ${index + 1}`;

        return (
          <div
            key={index}
            className="border border-jsyellow rounded-[24px] md:rounded-[32px] overflow-hidden bg-white"
          >
            <button
              type="button"
              className="w-full p-4 md:p-5 flex justify-between items-center bg-[#fef7eb] text-left"
              onClick={() => setOpenModule(isOpen ? null : index)}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-jsyellow text-white flex items-center justify-center mr-3 md:mr-4 rounded-full text-base md:text-lg">
                  {index + 1}
                </div>
                <span
                  className="font-semibold text-sm md:text-base [@media(min-width:2500px)]:!text-3xl"
                >
                  {moduleTitle}
                </span>
              </div>
              <span
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ↓
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 px-4 md:pb-6 md:px-6 bg-white">
                  <ul className="list-disc list-inside p-4 space-y-2 [@media(min-width:3500px)]:text-2xl text-sm md:text-base">
                    {(module as any)?.module?.content?.map?.((item: any, idx: number) => {
                      const line =
                        item?.[locale] ?? item?.az ?? item?.en ?? String(item ?? "");
                      return (
                        <li
                          key={idx}
                          className="[@media(min-width:3500px)]:!text-3xl"
                        >
                          {line}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
