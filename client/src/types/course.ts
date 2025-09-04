import { PaginatedResponse } from "./general";

interface MultilingualContent {
  az: string;
  ru: string;
}
export interface CourseFormInputs {
  title: MultilingualContent;
  description: MultilingualContent;
  shortDescription?: MultilingualContent;
  slug: MultilingualContent;
  duration: number;
  level: MultilingualContent;
  imageUrl?: string;
  published: boolean;
  image?: FileList | File | null;
  tag?: string[];
  icon?: string;
  ageRange?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  newTags?: {
    az: string[];
    ru: string[];
  };
}
interface ModuleContent extends MultilingualContent {
  order: number;
}

export interface Module {
  id: string;
  title: MultilingualContent;
  description: MultilingualContent;
  content: ModuleContent[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  moduleId: string;
  order: number;
  createdAt: string;
  module: Module;
}
export interface ContentInput {
  az: string;
  ru: string;
  order: number;
}
export interface ModuleFormInputs {
  title: {
    az: string;
    ru: string;
  };
  description: {
    az: string;
    ru: string;
  };
  content: ContentInput[];
}

export interface Eligibility {
  id: string;
  title: MultilingualContent;
  description: MultilingualContent;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityFormInputs {
  title: {
    az: string;
    ru: string;
  };
  description: {
    az: string;
    ru: string;
  };
  icon: string;
}

export interface CourseEligibility {
  id: string;
  courseId: string;
  eligibilityId: string;
  createdAt: string;
  eligibility: Eligibility;
}

export interface Course {
  id: string;
  title: MultilingualContent;
  description: MultilingualContent;
  slug: MultilingualContent;
  level: MultilingualContent;
  duration: number;
  published: boolean;
  backgroundColor:string;
  borderColor:string;
  textColor:string;
  shortDescription:any;
  icon: string;
  ageRange?: string;
  newTags?: {
    az: string[];
    ru: string[];
  };
  imageUrl?: string;
  tag?: string[];
  createdAt: string;
  updatedAt: string;
  modules?: any[];
  teachers?: any[];
  eligibility?: any[];
}
export type CourseResponse = PaginatedResponse<Course>;
