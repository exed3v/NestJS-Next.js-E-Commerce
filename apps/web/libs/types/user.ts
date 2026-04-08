export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  // No incluir password aquí (debe tener endpoint separado)
}
