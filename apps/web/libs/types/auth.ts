import { User } from "./user";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
}
