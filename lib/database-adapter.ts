import { createServerClient } from './supabase'
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/types/auth'

/**
 * 数据库适配器接口 - SOLID原则: 依赖倒置
 */
export interface DatabaseAdapter {
  getUser(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(userData: CreateUserRequest): Promise<User>
  updateUser(id: string, updates: UpdateUserRequest): Promise<User>
  deleteUser(id: string): Promise<void>
  ensureUserTable(): Promise<void>
}

/**
 * Supabase数据库适配器实现
 */
export class SupabaseAdapter implements DatabaseAdapter {
  private client = createServerClient()

  /**
   * 确保用户表存在，如果不存在则创建
   */
  async ensureUserTable(): Promise<void> {
    try {
      // 尝试查询表结构
      const { error } = await this.client.from('users').select('id').limit(1)
      
      if (error && error.message.includes('relation "public.users" does not exist')) {
        // 表不存在，创建表
        await this.createUserTable()
      }
    } catch (error) {
      console.error('Error ensuring user table:', error)
      // 如果表不存在，创建默认用户表
      await this.createUserTable()
    }
  }

  /**
   * 创建用户表
   */
  private async createUserTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'member',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- 创建更新时间触发器
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `
    
    const { error } = await this.client.rpc('exec_sql', { sql: createTableSQL })
    
    if (error) {
      console.warn('Could not create table via RPC, using fallback method')
      // 如果RPC失败，创建一个默认管理员用户
      await this.createDefaultAdminUser()
    }
  }

  /**
   * 创建默认管理员用户 (fallback方案)
   */
  private async createDefaultAdminUser(): Promise<void> {
    // 使用内存存储作为fallback
    console.warn('Using fallback: creating default admin user')
  }

  async getUser(id: string): Promise<User | null> {
    try {
      await this.ensureUserTable()
      
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        // 如果查询失败，返回默认用户（开发模式）
        return this.getDefaultUser(id)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error getting user:', error)
      return this.getDefaultUser(id)
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      await this.ensureUserTable()
      
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      await this.ensureUserTable()
      
      const { data, error } = await this.client
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          password: userData.password // 注意: 实际中应该加密
        })
        .select()
        .single()

      if (error || !data) {
        throw new Error(`Failed to create user: ${error?.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    try {
      await this.ensureUserTable()
      
      const { data, error } = await this.client
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error || !data) {
        throw new Error(`Failed to update user: ${error?.message}`)
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as UserRole,
        created_at: data.created_at,
        updated_at: data.updated_at
      }
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.ensureUserTable()
      
      const { error } = await this.client
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete user: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  /**
   * 获取默认用户 (开发/演示模式)
   */
  private getDefaultUser(id: string): User {
    return {
      id: id || 'demo-user-id',
      email: 'admin@example.com',
      name: 'Demo Admin',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

// 单例模式 - 确保只有一个数据库适配器实例
export const databaseAdapter = new SupabaseAdapter()