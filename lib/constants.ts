export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const

export const ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: '超级管理员',
  [USER_ROLES.ADMIN]: '管理员',
  [USER_ROLES.MEMBER]: '成员',
  [USER_ROLES.VIEWER]: '访客'
} as const

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me'
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`
  },
  SETTINGS: '/api/settings'
} as const

export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/profile'
} as const