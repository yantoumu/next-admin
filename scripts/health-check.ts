#!/usr/bin/env tsx

/**
 * 🏥 项目健康检查脚本
 * 检查项目配置、依赖、数据库连接等
 */

import fs from 'fs';
import path from 'path';
import dbConnect from '../lib/db';
import User from '../lib/models/User';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`${colors.cyan}🔍 ${msg}${colors.reset}`),
};

interface HealthCheckResult {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
}

const results: HealthCheckResult[] = [];

/**
 * 添加检查结果
 */
function addResult(name: string, status: 'pass' | 'warning' | 'fail', message: string, details?: string) {
  results.push({ name, status, message, details });
}

/**
 * 检查Node.js版本
 */
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    addResult('Node.js版本', 'pass', `${nodeVersion} (推荐)`);
  } else if (majorVersion >= 16) {
    addResult('Node.js版本', 'warning', `${nodeVersion} (建议升级到18+)`);
  } else {
    addResult('Node.js版本', 'fail', `${nodeVersion} (需要18+)`);
  }
}

/**
 * 检查环境变量配置
 */
function checkEnvironmentVariables() {
  const envFile = '.env.local';
  
  if (!fs.existsSync(envFile)) {
    addResult('环境变量', 'fail', '缺少 .env.local 文件');
    return;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf-8');
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length === 0) {
    addResult('环境变量', 'pass', '所有必需的环境变量已配置');
  } else {
    addResult('环境变量', 'fail', `缺少环境变量: ${missingVars.join(', ')}`);
  }
  
  // 检查JWT_SECRET强度
  const jwtSecretMatch = envContent.match(/JWT_SECRET="?([^"\n]+)"?/);
  if (jwtSecretMatch) {
    const jwtSecret = jwtSecretMatch[1];
    if (jwtSecret.length < 32) {
      addResult('JWT密钥强度', 'warning', 'JWT_SECRET长度建议至少32位');
    } else if (jwtSecret.includes('your-super-secret') || jwtSecret.includes('change-in-production')) {
      addResult('JWT密钥强度', 'fail', '请更改默认的JWT_SECRET');
    } else {
      addResult('JWT密钥强度', 'pass', 'JWT_SECRET配置安全');
    }
  }
}

/**
 * 检查必需文件
 */
function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'lib/db.ts',
    'lib/auth.ts',
    'lib/permissions.ts',
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length === 0) {
    addResult('必需文件', 'pass', '所有必需文件存在');
  } else {
    addResult('必需文件', 'fail', `缺少文件: ${missingFiles.join(', ')}`);
  }
}

/**
 * 检查数据库连接
 */
async function checkDatabaseConnection() {
  try {
    await dbConnect();
    
    // 尝试查询用户数量
    const userCount = await User.countDocuments();
    addResult('数据库连接', 'pass', `连接成功，${userCount} 个用户`);
    
    if (userCount === 0) {
      addResult('数据库数据', 'warning', '数据库为空，建议运行种子脚本');
    } else {
      addResult('数据库数据', 'pass', '数据库包含用户数据');
    }
    
  } catch (error) {
    addResult('数据库连接', 'fail', `连接失败: ${error}`);
  }
}

/**
 * 检查依赖包
 */
function checkDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const dependencies = packageJson.dependencies || {};
    
    const criticalDeps = [
      'next',
      'react',
      'mongoose',
      'jsonwebtoken',
      'bcryptjs',
      'tailwindcss',
    ];
    
    const missingDeps = criticalDeps.filter(dep => !dependencies[dep]);
    
    if (missingDeps.length === 0) {
      addResult('关键依赖', 'pass', '所有关键依赖已安装');
    } else {
      addResult('关键依赖', 'fail', `缺少依赖: ${missingDeps.join(', ')}`);
    }
    
    // 检查node_modules
    if (fs.existsSync('node_modules')) {
      addResult('依赖安装', 'pass', 'node_modules 存在');
    } else {
      addResult('依赖安装', 'fail', '请运行 npm install');
    }
    
  } catch (error) {
    addResult('依赖检查', 'fail', `检查失败: ${error}`);
  }
}

/**
 * 检查TypeScript配置
 */
function checkTypeScriptConfig() {
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
    
    if (tsConfig.compilerOptions?.strict) {
      addResult('TypeScript配置', 'pass', '严格模式已启用');
    } else {
      addResult('TypeScript配置', 'warning', '建议启用严格模式');
    }
    
  } catch (error) {
    addResult('TypeScript配置', 'fail', 'tsconfig.json 配置错误');
  }
}

/**
 * 显示检查结果
 */
function displayResults() {
  console.log('\n' + '='.repeat(60));
  log.title('项目健康检查报告');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let warningCount = 0;
  let failCount = 0;
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    const color = result.status === 'pass' ? colors.green : result.status === 'warning' ? colors.yellow : colors.red;
    
    console.log(`${color}${icon} ${result.name}: ${result.message}${colors.reset}`);
    
    if (result.details) {
      console.log(`   ${result.details}`);
    }
    
    if (result.status === 'pass') passCount++;
    else if (result.status === 'warning') warningCount++;
    else failCount++;
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`${colors.green}✅ 通过: ${passCount}${colors.reset}  ${colors.yellow}⚠️  警告: ${warningCount}${colors.reset}  ${colors.red}❌ 失败: ${failCount}${colors.reset}`);
  
  if (failCount === 0 && warningCount === 0) {
    console.log(`${colors.green}\n🎉 项目健康状况良好！${colors.reset}`);
  } else if (failCount === 0) {
    console.log(`${colors.yellow}\n⚠️  项目基本正常，但有一些建议改进的地方${colors.reset}`);
  } else {
    console.log(`${colors.red}\n🚨 项目存在问题，需要修复后才能正常运行${colors.reset}`);
  }
  
  console.log('='.repeat(60));
}

/**
 * 主函数
 */
async function main() {
  log.title('开始项目健康检查...');
  
  // 执行所有检查
  checkNodeVersion();
  checkEnvironmentVariables();
  checkRequiredFiles();
  checkDependencies();
  checkTypeScriptConfig();
  await checkDatabaseConnection();
  
  // 显示结果
  displayResults();
  
  process.exit(0);
}

// 运行健康检查
main().catch(error => {
  log.error(`健康检查失败: ${error}`);
  process.exit(1);
});
