export interface JwtUser {
  id: string;
  email: string;
  role: string;
  fullName?: string | null;
}
