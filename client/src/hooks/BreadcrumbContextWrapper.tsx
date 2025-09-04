"use client";
import { ReactNode } from "react";
import { BreadcrumbTitleContext } from "./BreadcrumbTitleContext";

type Props = {
  title: string;
  children: ReactNode;
};
export default function BreadcrumbContextWrapper({ title, children }: Props) {
  return (
    <BreadcrumbTitleContext.Provider value={{ dynamicTitle: title }}>
      {children}
    </BreadcrumbTitleContext.Provider>
  );
}
