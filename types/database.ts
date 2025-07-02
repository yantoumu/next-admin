export interface DatabaseUser {
  id: string
  email: string
  password: string | null
  name: string | null
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  created_at: Date
  updated_at: Date
}

export interface DatabaseSettings {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  created_at: Date
  updated_at: Date
}

export interface MenuItem {
  name: string
  href: string
  icon: string
  permission?: string
  children?: MenuItem[]
}