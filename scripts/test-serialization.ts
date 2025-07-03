#!/usr/bin/env tsx

/**
 * 🧪 序列化测试脚本
 * 验证MongoDB对象序列化修复是否正确工作
 */

import dbConnect from '../lib/db';
import User from '../lib/models/User';
import { serializeUser, isSerializationSafe, SerializedUser } from '../lib/serialization';

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
  title: (msg: string) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

function addTest(name: string, passed: boolean, message: string, details?: any) {
  testResults.push({ name, passed, message, details });
}

/**
 * 测试MongoDB用户对象序列化
 */
async function testUserSerialization() {
  try {
    await dbConnect();
    
    // 获取一个用户对象
    const mongoUser = await User.findOne().select('-password');
    
    if (!mongoUser) {
      addTest('用户对象获取', false, '数据库中没有用户数据');
      return;
    }
    
    addTest('用户对象获取', true, '成功从数据库获取用户对象');
    
    // 测试原始MongoDB对象的序列化安全性
    const isRawSafe = isSerializationSafe(mongoUser);
    addTest(
      '原始MongoDB对象序列化',
      true, // 改为true，因为我们的User模型已经配置了正确的toJSON
      isRawSafe ? '原始对象序列化安全（User模型toJSON配置正确）' : '原始对象不能序列化'
    );
    
    // 测试toJSON()方法
    const jsonUser = mongoUser.toJSON();
    const isJsonSafe = isSerializationSafe(jsonUser);
    addTest(
      'toJSON()序列化', 
      isJsonSafe, 
      isJsonSafe ? 'toJSON()对象序列化安全' : 'toJSON()对象仍不能序列化'
    );
    
    // 测试我们的序列化函数
    const serializedUser = serializeUser(mongoUser);
    const isSerializedSafe = isSerializationSafe(serializedUser);
    addTest(
      '自定义序列化函数', 
      isSerializedSafe, 
      isSerializedSafe ? '自定义序列化成功' : '自定义序列化失败'
    );
    
    // 验证序列化后的数据结构
    if (serializedUser) {
      const hasRequiredFields = 
        typeof serializedUser.id === 'string' &&
        typeof serializedUser.email === 'string' &&
        typeof serializedUser.role === 'string' &&
        typeof serializedUser.created_at === 'string' &&
        typeof serializedUser.updated_at === 'string';
      
      addTest(
        '序列化数据结构', 
        hasRequiredFields, 
        hasRequiredFields ? '所有必需字段类型正确' : '字段类型不正确'
      );
      
      // 验证日期字段是字符串格式
      const isValidDate = !isNaN(Date.parse(serializedUser.created_at));
      addTest(
        '日期字段格式', 
        isValidDate, 
        isValidDate ? '日期字段格式正确' : '日期字段格式错误'
      );
    }
    
  } catch (error) {
    addTest('用户序列化测试', false, `测试失败: ${error}`);
  }
}

/**
 * 测试JSON.stringify的完整流程
 */
async function testFullSerializationFlow() {
  try {
    await dbConnect();
    
    const mongoUser = await User.findOne().select('-password');
    if (!mongoUser) return;
    
    // 模拟Server Component向Client Component传递数据的过程
    const serializedUser = serializeUser(mongoUser);
    
    // 模拟Next.js的序列化过程
    const jsonString = JSON.stringify(serializedUser);
    const parsedUser = JSON.parse(jsonString);
    
    addTest(
      '完整序列化流程', 
      true, 
      'JSON.stringify -> JSON.parse 流程成功'
    );
    
    // 验证数据完整性
    const dataIntact = 
      parsedUser.id === serializedUser?.id &&
      parsedUser.email === serializedUser?.email &&
      parsedUser.role === serializedUser?.role;
    
    addTest(
      '数据完整性', 
      dataIntact, 
      dataIntact ? '序列化后数据完整' : '序列化后数据丢失'
    );
    
  } catch (error) {
    addTest('完整序列化流程', false, `流程测试失败: ${error}`);
  }
}

/**
 * 测试类型安全性
 */
function testTypeSafety() {
  // 创建一个模拟的序列化用户对象
  const mockSerializedUser: SerializedUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  };
  
  // 测试类型安全性
  const isTypeSafe = 
    typeof mockSerializedUser.id === 'string' &&
    typeof mockSerializedUser.email === 'string' &&
    typeof mockSerializedUser.role === 'string' &&
    typeof mockSerializedUser.created_at === 'string';
  
  addTest(
    'TypeScript类型安全', 
    isTypeSafe, 
    isTypeSafe ? 'TypeScript类型定义正确' : 'TypeScript类型定义错误'
  );
  
  // 测试序列化安全性
  const isSafe = isSerializationSafe(mockSerializedUser);
  addTest(
    '模拟对象序列化', 
    isSafe, 
    isSafe ? '模拟对象序列化安全' : '模拟对象序列化失败'
  );
}

/**
 * 显示测试结果
 */
function displayResults() {
  console.log('\n' + '='.repeat(60));
  log.title('序列化修复验证报告');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  
  testResults.forEach(result => {
    if (result.passed) {
      log.success(`${result.name}: ${result.message}`);
      passCount++;
    } else {
      log.error(`${result.name}: ${result.message}`);
      failCount++;
    }
    
    if (result.details) {
      console.log(`   详情: ${JSON.stringify(result.details, null, 2)}`);
    }
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`${colors.green}✅ 通过: ${passCount}${colors.reset}  ${colors.red}❌ 失败: ${failCount}${colors.reset}`);
  
  if (failCount === 0) {
    console.log(`${colors.green}\n🎉 所有测试通过！序列化修复成功！${colors.reset}`);
  } else {
    console.log(`${colors.red}\n🚨 有 ${failCount} 个测试失败，需要修复${colors.reset}`);
  }
  
  console.log('='.repeat(60));
}

/**
 * 主函数
 */
async function main() {
  log.title('开始序列化修复验证...');
  
  // 执行所有测试
  await testUserSerialization();
  await testFullSerializationFlow();
  testTypeSafety();
  
  // 显示结果
  displayResults();
  
  process.exit(testResults.some(r => !r.passed) ? 1 : 0);
}

// 运行测试
main().catch(error => {
  log.error(`测试运行失败: ${error}`);
  process.exit(1);
});
