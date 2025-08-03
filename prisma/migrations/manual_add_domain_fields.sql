-- 添加域名信息新字段的安全迁移脚本
-- 执行前请确保已备份数据库

BEGIN;

-- 添加 top_countries 字段（JSON格式）
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS top_countries JSON;

-- 添加 top_keywords 字段（JSON格式）
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS top_keywords JSON;

-- 添加 category_rank 字段
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS category_rank INTEGER;

-- 为新字段添加注释
COMMENT ON COLUMN domain_info.top_countries IS '热门访问国家分布 [{country: string, visits: number, percentage: number}]';
COMMENT ON COLUMN domain_info.top_keywords IS 'SEO关键词数据 [{keyword: string, position: number, volume: number}]';
COMMENT ON COLUMN domain_info.category_rank IS '分类内排名';

-- 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_domain_info_category_rank ON domain_info(category_rank);

COMMIT;