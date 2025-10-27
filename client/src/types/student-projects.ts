export type LangBlock = {
  az: string;
  ru: string;
};

export interface ProjectFormInputs {
  title: LangBlock;
  description: LangBlock;
  categoryId: string;
  link: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: LangBlock;
  description: LangBlock;
  imageUrl?: string;
  link: string;
  author?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  category: {
    id: string;
    name: string;
  };
  order: number;
}

export interface ProjectResponse {
  items: Project[];
  total?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
