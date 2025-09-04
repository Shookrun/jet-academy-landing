export interface GalleryFormInputs {
  title?: {
    az: string;
    ru: string;
  };
  image: FileList;
}

export interface GalleryImage {
  id: string;
  title: {
    az: string;
    ru: string;
  };
  imageUrl: string;
  createdAt: string;
}

export interface GalleryResponse {
  items: GalleryImage[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
