-- 添加域名信息扩展字段的安全迁移脚本
-- 执行前请确保已备份数据库

BEGIN;

-- 添加网站信息字段
ALTER TABLE domain_info 
ADD COLUMN IF NOT EXISTS domain_status TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category_name VARCHAR(100);

-- 添加流量扩展信息字段
ALTER TABLE domain_info
ADD COLUMN IF NOT EXISTS traffic_period VARCHAR(50),
ADD COLUMN IF NOT EXISTS traffic_paid DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS traffic_mail DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS monthly_trend JSON;

-- 添加字段注释
COMMENT ON COLUMN domain_info.domain_status IS '域名状态数组';
COMMENT ON COLUMN domain_info.title IS '网站标题';
COMMENT ON COLUMN domain_info.description IS '网站描述';
COMMENT ON COLUMN domain_info.category_name IS '分类名称（格式化）';
COMMENT ON COLUMN domain_info.traffic_period IS '流量统计周期';
COMMENT ON COLUMN domain_info.traffic_paid IS '付费流量百分比';
COMMENT ON COLUMN domain_info.traffic_mail IS '邮件流量百分比';
COMMENT ON COLUMN domain_info.monthly_trend IS '月度流量趋势';

-- 更新已有JSON字段的注释（反映真实数据格式）
COMMENT ON COLUMN domain_info.top_countries IS '热门访问国家分布 [{code: string, percentage: number}]';
COMMENT ON COLUMN domain_info.top_keywords IS 'SEO关键词数据 [{keyword: string, volume: number, traffic: number, cpc?: string}]';

COMMIT;