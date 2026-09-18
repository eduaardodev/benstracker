export type UserRole = 'ADMIN' | 'TECHNICIAN';

export interface User {
  id: string;
  name: string;
  matricula: string;
  email: string;
  department: string;
  jobTitle: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface AuthTokenPayload {
  userId: string;
  email: string;
  matricula: string;
  name: string;
  role: UserRole;
}

export interface LoginDTO {
  identifier: string; // E-mail ou Matrícula
  password: string;
}

export interface RegisterDTO {
  name: string;
  matricula: string;
  email: string;
  department: string;
  jobTitle: string;
  role?: UserRole;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: SafeUser;
  expiresIn: string;
}
