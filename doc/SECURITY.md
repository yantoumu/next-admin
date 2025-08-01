# 🛡️ 安全指南

## 🚨 重要安全更新

### ✅ 已修复的安全漏洞
- **严重漏洞已修复**：删除了不安全的公开注册页面 `/register`
- **认证系统重构**：从Supabase迁移到安全的MongoDB + JWT系统
- **权限验证加强**：所有API路由和页面都有完整的权限检查

## 🔒 当前安全措施

### 1. 认证系统
- **JWT Token认证**：使用HttpOnly cookies存储
- **密码哈希**：使用bcrypt进行安全哈希
- **会话管理**：7天过期时间，支持记住我功能
- **安全Cookie**：HttpOnly, Secure, SameSite设置

### 2. 权限控制
- **基于角色的访问控制（RBAC）**
  - `super_admin`：超级管理员，所有权限
  - `admin`：系统管理员，大部分权限
  - `member`：普通成员，基础权限
  - `viewer`：查看者，只读权限

### 3. API安全
- **认证要求**：所有敏感API都需要认证
- **权限验证**：基于用户角色的细粒度权限控制
- **输入验证**：使用Zod进行数据验证
- **错误处理**：统一的错误响应格式

### 4. 页面安全
- **路由保护**：Dashboard页面需要认证
- **权限检查**：管理功能需要相应权限
- **会话验证**：自动检查会话有效性

## 🔧 安全配置

### 1. 环境变量安全
```bash
# 生产环境必须使用强密码
JWT_SECRET="至少32位的随机字符串"

# 数据库连接使用SSL
DATABASE_URL="mongodb+srv://..."

# 生产环境标识
NODE_ENV=production
```

### 2. 数据库安全
- **连接加密**：使用SSL/TLS连接
- **访问控制**：限制数据库访问IP
- **认证启用**：数据库用户认证
- **定期备份**：自动化备份策略

### 3. 应用安全
- **HTTPS强制**：生产环境必须使用HTTPS
- **安全头部**：设置适当的HTTP安全头部
- **依赖更新**：定期更新依赖包
- **代码审计**：定期进行安全代码审查

## 🚫 安全限制

### 1. 用户注册
- **❌ 公开注册已禁用**：防止未授权用户自行注册
- **✅ 管理员创建**：只有管理员可以创建新用户
- **✅ 权限控制**：新用户默认为最低权限

### 2. 访问控制
- **认证要求**：所有管理功能都需要登录
- **权限验证**：基于角色的功能访问控制
- **会话超时**：自动登出机制
- **并发限制**：防止暴力破解

## 📋 安全检查清单

### 部署前检查
- [ ] 更改默认JWT_SECRET
- [ ] 配置安全的数据库连接
- [ ] 启用HTTPS
- [ ] 设置防火墙规则
- [ ] 配置安全头部
- [ ] 修改默认管理员密码

### 运行时监控
- [ ] 监控登录失败次数
- [ ] 记录用户操作日志
- [ ] 监控异常API调用
- [ ] 检查会话异常
- [ ] 监控数据库访问

### 定期维护
- [ ] 更新依赖包
- [ ] 审查用户权限
- [ ] 检查访问日志
- [ ] 备份数据库
- [ ] 安全漏洞扫描

## 🆘 安全事件响应

### 1. 发现安全问题
1. **立即隔离**：停止受影响的服务
2. **评估影响**：确定影响范围
3. **修复漏洞**：应用安全补丁
4. **验证修复**：测试安全措施
5. **恢复服务**：重新启动服务

### 2. 用户账户安全
- **密码重置**：强制用户重置密码
- **会话失效**：使所有会话失效
- **权限审查**：重新审查用户权限
- **监控加强**：增强监控措施

### 3. 数据安全
- **数据备份**：确保数据完整性
- **访问审计**：审查数据访问记录
- **加密检查**：验证数据加密状态
- **合规报告**：生成安全事件报告

## 📞 安全联系方式

如发现安全漏洞，请立即联系：
- 项目维护者
- 安全团队
- GitHub Security Advisory

**请勿公开披露安全漏洞，直到修复完成。**
