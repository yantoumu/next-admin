export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationData {
  current: number
  total: number
  pages: number
  limit: number
}

export interface UsersQuery {
  page?: number
  limit?: number
  search?: string
  role?: string
  sort?: 'name' | 'email' | 'created_at'
  order?: 'asc' | 'desc'
}

export interface UsersResponse {
  success: boolean
  data: {
    users: any[]
    pagination: PaginationData
  }
}

export interface LoginResponse {
  success: boolean
  data: {
    user: any
    token: string
  }
  message: string
}

export interface MeResponse {
  success: boolean
  data: any | null
}