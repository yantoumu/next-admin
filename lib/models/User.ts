import mongoose, { Schema, Document, Model } from 'mongoose'

// 用户角色枚举
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin', 
  MEMBER = 'member',
  VIEWER = 'viewer'
}

// 用户接口定义
export interface IUser extends Document {
  _id: string
  email: string
  password?: string
  name?: string
  role: UserRole
  created_at: Date
  updated_at: Date
}

// 用户 Schema 定义
const UserSchema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, '邮箱是必填项'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请输入有效的邮箱地址']
    },
    password: {
      type: String,
      required: [true, '密码是必填项'],
      minlength: [6, '密码至少需要6个字符']
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, '姓名不能超过50个字符']
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
      required: true
    }
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    },
    collection: 'users' // 明确指定集合名称
  }
)

// 创建索引以优化查询性能
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ created_at: -1 })

// 虚拟字段：不包含密码的用户信息
UserSchema.virtual('safeUser').get(function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
})

// JSON 序列化时的转换
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.password // 安全起见，序列化时不包含密码
    return ret
  }
})

// 防止重复编译模型
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User