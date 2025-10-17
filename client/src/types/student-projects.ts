export interface ProjectFormInputs {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface Project {
  id: string;
  description: {
    az: string;
    en: string;
  };
  imageUrl: string;
  link: string;
  author: string;
  title: {
    az: string;
    en: string;
  };
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  order: number;
}

export interface ProjectResponse {
  items: Project[];
  total: number;
}
