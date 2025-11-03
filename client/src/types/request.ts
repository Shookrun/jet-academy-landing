import { PaginatedResponse } from "./general";

export enum RequestStatus {
  PENDING = "PENDING",
  VIEWED = "VIEWED",
}

export enum Language {
  AZ = "AZ",
  EN = "EN",
}

export interface Request {
  id: string;
  name: string;
  surname: string;
  number: string;
  childAge: number;
  childLanguage: Language;
  status: RequestStatus;
  additionalInfo?: Record<string, any>;
  createdAt: string;
  viewedBy?: string;
  viewedAt?: string;
}

export interface RequestFormInputs {
  name: string;
  surname: string;
  number: string;

  childAge: number;
  childLanguage: Language;

  courseId?: string;
}

export type RequestResponse = PaginatedResponse<Request>;

export const statusColorMap: Record<
  RequestStatus,
  "warning" | "success" | "danger"
> = {
  PENDING: "warning",
  VIEWED: "success",
};

export const statusLabels: Record<RequestStatus, string> = {
  PENDING: "Gözləyir",
  VIEWED: "Baxılıb",
};

export const languageLabels: Record<Language, string> = {
  AZ: "Azərbaycan dili",
  EN: "Ingilis dili",
};
