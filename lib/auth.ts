import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase, createServerClient } from './supabase'
import { User, UserRole } from '@/types/auth'
import { PAGE_ROUTES } from './constants'

/**
 * 获取当前用户信息 (客户端)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // 从数据库获取完整用户信息
    const serverClient = createServerClient()
    const { data: userData, error: dbError } = await serverClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (dbError || !userData) {
      return null
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as UserRole,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * 获取当前用户信息 (服务端)
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value
    
    if (!accessToken) {
      return null
    }

    const serverClient = createServerClient()
    const { data: { user }, error } = await serverClient.auth.getUser(accessToken)
    
    if (error || !user) {
      return null
    }

    // 从数据库获取完整用户信息
    const { data: userData, error: dbError } = await serverClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (dbError || !userData) {
      return null
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as UserRole,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    }
  } catch (error) {
    console.error('Error getting current user (server):', error)
    return null
  }
}

/**
 * 用户登录
 */
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * 用户注册
 */
export async function registerUser(email: string, password: string, name: string, role: UserRole = 'member') {
  try {
    // 创建认证用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError || !authData.user) {
      throw authError
    }

    // 创建用户记录
    const serverClient = createServerClient()
    const { data: userData, error: dbError } = await serverClient
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role
      })
      .select()
      .single()

    if (dbError) {
      // 如果数据库插入失败，清理认证用户
      await serverClient.auth.admin.deleteUser(authData.user.id)
      throw dbError
    }

    return userData
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * 用户登出
 */
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * 重置密码
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}