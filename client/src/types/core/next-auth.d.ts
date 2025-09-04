import "next-auth";
import { DefaultSession } from "next-auth";
import { Role } from "../enums";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    accessToken: string;
  }
}
