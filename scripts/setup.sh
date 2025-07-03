#!/bin/bash

# 🚀 Next.js Admin Dashboard 快速启动脚本
# 自动化项目初始化和配置

set -e

echo "🚀 开始初始化 Next.js Admin Dashboard..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
check_node() {
    echo -e "${BLUE}📋 检查 Node.js 版本...${NC}"
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js 18+${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 版本过低，需要 18+，当前版本: $(node -v)${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js 版本检查通过: $(node -v)${NC}"
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}📦 安装项目依赖...${NC}"
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 配置环境变量
setup_env() {
    echo -e "${BLUE}⚙️  配置环境变量...${NC}"
    
    if [ ! -f .env.local ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}📝 已创建 .env.local 文件${NC}"
        echo -e "${YELLOW}⚠️  请编辑 .env.local 配置数据库连接${NC}"
        
        # 生成随机 JWT Secret
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i.bak "s/your-super-secret-jwt-key-change-in-production/$JWT_SECRET/" .env.local
        rm .env.local.bak
        echo -e "${GREEN}✅ 已生成随机 JWT_SECRET${NC}"
    else
        echo -e "${YELLOW}📝 .env.local 已存在，跳过创建${NC}"
    fi
}

# 检查数据库连接
check_database() {
    echo -e "${BLUE}🗄️  检查数据库连接...${NC}"
    
    if npm run test:db 2>/dev/null; then
        echo -e "${GREEN}✅ 数据库连接成功${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  数据库连接失败，请检查 DATABASE_URL 配置${NC}"
        return 1
    fi
}

# 初始化数据
init_data() {
    echo -e "${BLUE}🌱 初始化种子数据...${NC}"
    
    if npm run seed; then
        echo -e "${GREEN}✅ 种子数据初始化完成${NC}"
        echo -e "${GREEN}📧 默认管理员账户: admin@example.com${NC}"
        echo -e "${GREEN}🔑 默认密码: admin123456${NC}"
        echo -e "${YELLOW}⚠️  请立即修改默认密码！${NC}"
    else
        echo -e "${RED}❌ 种子数据初始化失败${NC}"
        exit 1
    fi
}

# 启动开发服务器
start_dev() {
    echo -e "${BLUE}🚀 启动开发服务器...${NC}"
    echo -e "${GREEN}🌐 访问地址: http://localhost:3000${NC}"
    echo -e "${GREEN}📧 管理员账户: admin@example.com${NC}"
    echo -e "${GREEN}🔑 密码: admin123456${NC}"
    echo ""
    echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
    
    npm run dev
}

# 主函数
main() {
    echo -e "${GREEN}🎯 Next.js Admin Dashboard 快速启动${NC}"
    echo "=================================="
    
    check_node
    install_dependencies
    setup_env
    
    echo ""
    echo -e "${YELLOW}📋 请确保已配置数据库连接 (.env.local)${NC}"
    read -p "是否继续初始化数据？(y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if check_database; then
            init_data
            echo ""
            echo -e "${GREEN}🎉 项目初始化完成！${NC}"
            echo ""
            read -p "是否立即启动开发服务器？(Y/n): " -n 1 -r
            echo
            
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                start_dev
            fi
        else
            echo -e "${RED}❌ 请先配置正确的数据库连接${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⏭️  跳过数据初始化${NC}"
        echo -e "${GREEN}✅ 基础配置完成${NC}"
    fi
}

# 执行主函数
main "$@"
