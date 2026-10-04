export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  botsCount: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}
