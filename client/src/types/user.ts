import { Role } from "./enums";
import { PaginatedResponse } from "./general";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  createdAt: string;
}

export type UserResponse = PaginatedResponse<User>;
