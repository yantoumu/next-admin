import dbConnect from './db'
import UserModel from './models/User'
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/types/auth'
import bcrypt from 'bcryptjs'

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
 * MongoDB数据库适配器实现
 */
export class MongoDBAdapter implements DatabaseAdapter {
  /**
   * 确保数据库连接
   */
  async ensureUserTable(): Promise<void> {
    try {
      await dbConnect()
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      await this.ensureUserTable()
      const user = await UserModel.findById(id).select('-password')
      return user ? user.toJSON() : null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      await this.ensureUserTable()
      const user = await UserModel.findOne({ email }).select('-password')
      return user ? user.toJSON() : null
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      await this.ensureUserTable()

      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword
      })

      return user.toJSON()
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    try {
      await this.ensureUserTable()

      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 12)
      }

      const user = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-password')
      if (!user) {
        throw new Error('User not found')
      }

      return user.toJSON()
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.ensureUserTable()
      await UserModel.findByIdAndDelete(id)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }
}

// 单例模式 - 确保只有一个数据库适配器实例
export const databaseAdapter = new MongoDBAdapter()