export type UserRole = 'super_admin' | 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  password?: string
}