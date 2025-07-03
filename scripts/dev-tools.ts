#!/usr/bin/env tsx

/**
 * 🛠️ 开发者工具脚本
 * 提供常用的开发和维护功能
 */

import { program } from 'commander';
import dbConnect from '../lib/db';
import User from '../lib/models/User';
import { UserRole } from '../types/auth';
import bcrypt from 'bcryptjs';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`),
};

/**
 * 创建管理员用户
 */
async function createAdmin(email: string, password: string, name?: string) {
  try {
    await dbConnect();
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      log.error(`用户 ${email} 已存在`);
      return;
    }
    
    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || '管理员',
      role: 'super_admin',
    });
    
    log.success(`管理员用户创建成功:`);
    console.log(`  📧 邮箱: ${user.email}`);
    console.log(`  👤 姓名: ${user.name}`);
    console.log(`  🔑 角色: ${user.role}`);
    console.log(`  🆔 ID: ${user._id}`);
    
  } catch (error) {
    log.error(`创建管理员失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

/**
 * 重置用户密码
 */
async function resetPassword(email: string, newPassword: string) {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email });
    if (!user) {
      log.error(`用户 ${email} 不存在`);
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    log.success(`用户 ${email} 密码重置成功`);
    
  } catch (error) {
    log.error(`密码重置失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

/**
 * 列出所有用户
 */
async function listUsers() {
  try {
    await dbConnect();
    
    const users = await User.find().select('-password').sort({ created_at: -1 });
    
    log.title('用户列表:');
    console.table(users.map(user => ({
      ID: user._id.toString().slice(-8),
      邮箱: user.email,
      姓名: user.name || '-',
      角色: user.role,
      创建时间: user.created_at.toLocaleDateString('zh-CN'),
    })));
    
    log.info(`总计 ${users.length} 个用户`);
    
  } catch (error) {
    log.error(`获取用户列表失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

/**
 * 删除用户
 */
async function deleteUser(email: string) {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email });
    if (!user) {
      log.error(`用户 ${email} 不存在`);
      return;
    }
    
    await User.findByIdAndDelete(user._id);
    log.success(`用户 ${email} 删除成功`);
    
  } catch (error) {
    log.error(`删除用户失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

/**
 * 数据库状态检查
 */
async function checkDatabase() {
  try {
    await dbConnect();
    
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ 
      role: { $in: ['super_admin', 'admin'] }
    });
    
    log.title('数据库状态:');
    console.log(`  📊 总用户数: ${userCount}`);
    console.log(`  👑 管理员数: ${adminCount}`);
    console.log(`  🗄️  数据库连接: 正常`);
    
    if (userCount === 0) {
      log.warning('数据库为空，建议运行种子脚本初始化数据');
    }
    
  } catch (error) {
    log.error(`数据库检查失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

/**
 * 清理数据库
 */
async function cleanDatabase() {
  try {
    await dbConnect();
    
    const result = await User.deleteMany({});
    log.success(`数据库清理完成，删除了 ${result.deletedCount} 个用户`);
    
  } catch (error) {
    log.error(`数据库清理失败: ${error}`);
  } finally {
    process.exit(0);
  }
}

// 命令行程序配置
program
  .name('dev-tools')
  .description('Next.js Admin Dashboard 开发者工具')
  .version('1.0.0');

program
  .command('create-admin')
  .description('创建管理员用户')
  .requiredOption('-e, --email <email>', '管理员邮箱')
  .requiredOption('-p, --password <password>', '管理员密码')
  .option('-n, --name <name>', '管理员姓名')
  .action((options) => {
    createAdmin(options.email, options.password, options.name);
  });

program
  .command('reset-password')
  .description('重置用户密码')
  .requiredOption('-e, --email <email>', '用户邮箱')
  .requiredOption('-p, --password <password>', '新密码')
  .action((options) => {
    resetPassword(options.email, options.password);
  });

program
  .command('list-users')
  .description('列出所有用户')
  .action(() => {
    listUsers();
  });

program
  .command('delete-user')
  .description('删除用户')
  .requiredOption('-e, --email <email>', '用户邮箱')
  .action((options) => {
    deleteUser(options.email);
  });

program
  .command('check-db')
  .description('检查数据库状态')
  .action(() => {
    checkDatabase();
  });

program
  .command('clean-db')
  .description('清理数据库（删除所有用户）')
  .action(() => {
    cleanDatabase();
  });

// 解析命令行参数
program.parse();
