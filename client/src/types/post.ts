import { EventStatus, PostType } from "./enums";

interface MultilingualText {
  az: string;
  en: string;
}

export interface Post {
  id: string;
  title: MultilingualText;
  content: MultilingualText;
  slug: MultilingualText;
  published: boolean;
  imageUrl?: string;
  tags: string[];
  postType: PostType;
  eventDate?: Date | string;
  eventStatus?: EventStatus;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  offerStartDate?: Date | string;
  offerEndDate?: Date | string;
}

export interface PostFormInputs {
  title: MultilingualText;
  content: MultilingualText;
  slug: MultilingualText;
  published: boolean;
  imageUrl?: string;
  image?: FileList | File;
  tags: string[];
  postType: PostType;
  eventDate?: string;
  eventStatus?: EventStatus;
  offerStartDate?: string;
  offerEndDate?: string;
}

export interface PostsResponse {
  items: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
