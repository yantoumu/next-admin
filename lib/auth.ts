import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase, createServerClient } from './supabase'
import { User, UserRole } from '@/types/auth'
import { PAGE_ROUTES } from './constants'
import { databaseAdapter } from './database-adapter'

/**
 * 获取当前用户信息 (客户端)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // 使用数据库适配器获取完整用户信息
    return await databaseAdapter.getUser(user.id)
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
      // 如果没有访问令牌，返回默认演示用户（开发模式）
      return await databaseAdapter.getUser('demo-user-id')
    }

    const serverClient = createServerClient()
    const { data: { user }, error } = await serverClient.auth.getUser(accessToken)
    
    if (error || !user) {
      // 如果认证失败，返回默认演示用户（开发模式）
      return await databaseAdapter.getUser('demo-user-id')
    }

    // 使用数据库适配器获取完整用户信息
    return await databaseAdapter.getUser(user.id)
  } catch (error) {
    console.error('Error getting current user (server):', error)
    // 错误情况下返回默认用户
    return await databaseAdapter.getUser('demo-user-id')
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

    // 使用数据库适配器创建用户记录
    const userData = await databaseAdapter.createUser({
      email,
      name,
      password, // 注意: 实际中应该加密
      role
    })

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

/**
 * OAuth登录 - Google, GitHub, Twitter
 */
export async function loginWithOAuth(provider: 'google' | 'github' | 'twitter') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error(`OAuth ${provider} login error:`, error)
    throw error
  }
}

/**
 * 魔术链接登录
 */
export async function loginWithMagicLink(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Magic link login error:', error)
    throw error
  }
}

/**
 * 获取会话信息 (JWT模式)
 */
export async function getJWTSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }

    return session
  } catch (error) {
    console.error('Get JWT session error:', error)
    return null
  }
}

/**
 * 刷新会话令牌
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      throw error
    }

    return data.session
  } catch (error) {
    console.error('Refresh session error:', error)
    throw error
  }
}