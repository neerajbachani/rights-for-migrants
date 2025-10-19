// Authentication related types and interfaces

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  lastLogin: Date;
}

export interface AuthSession {
  userId: string;
  email: string;
  role: 'admin';
  expiresAt: Date;
  createdAt: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface VerifyResponse {
  success: boolean;
  user?: AdminUser;
}

export interface AuthContextType {
  user: AdminUser | null;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}