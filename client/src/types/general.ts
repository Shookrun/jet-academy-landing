export interface PaginationMeta {
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
