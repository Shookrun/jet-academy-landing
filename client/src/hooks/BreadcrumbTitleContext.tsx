"use client";
import { createContext, useContext } from "react";

type BreadcrumbTitleContextType = {
  dynamicTitle?: string;
};
export const BreadcrumbTitleContext = createContext<BreadcrumbTitleContextType>({});
export const useBreadcrumbTitle = () => useContext(BreadcrumbTitleContext);
