-- 完整的域名信息字段迁移脚本
-- 包含所有必需的字段以匹配真实数据结构
-- 执行前请确保已备份数据库

BEGIN;

-- 第一批：基础扩展字段
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS top_countries JSON,
ADD COLUMN IF NOT EXISTS top_keywords JSON,
ADD COLUMN IF NOT EXISTS category_rank INTEGER;

-- 第二批：网站信息字段
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS domain_status TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category_name VARCHAR(100);

-- 第三批：流量扩展信息字段
ALTER TABLE domain_info
ADD COLUMN IF NOT EXISTS traffic_period VARCHAR(50),
ADD COLUMN IF NOT EXISTS traffic_paid DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS traffic_mail DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS monthly_trend JSON;

-- 添加字段注释
COMMENT ON COLUMN domain_info.top_countries IS '热门访问国家分布 [{code: string, percentage: number}]';
COMMENT ON COLUMN domain_info.top_keywords IS 'SEO关键词数据 [{keyword: string, volume: number, traffic: number, cpc?: string}]';
COMMENT ON COLUMN domain_info.category_rank IS '分类内排名';
COMMENT ON COLUMN domain_info.domain_status IS '域名状态数组';
COMMENT ON COLUMN domain_info.title IS '网站标题';
COMMENT ON COLUMN domain_info.description IS '网站描述';
COMMENT ON COLUMN domain_info.category_name IS '分类名称（格式化）';
COMMENT ON COLUMN domain_info.traffic_period IS '流量统计周期';
COMMENT ON COLUMN domain_info.traffic_paid IS '付费流量百分比';
COMMENT ON COLUMN domain_info.traffic_mail IS '邮件流量百分比';
COMMENT ON COLUMN domain_info.monthly_trend IS '月度流量趋势';

-- 添加索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_domain_info_category_rank ON domain_info(category_rank);

COMMIT;