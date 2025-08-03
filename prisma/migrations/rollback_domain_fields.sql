-- 回滚域名信息新字段的脚本
-- 谨慎使用：这将删除字段及其数据

BEGIN;

-- 删除索引
DROP INDEX IF EXISTS idx_domain_info_category_rank;

-- 删除字段
ALTER TABLE domain_info 
DROP COLUMN IF EXISTS top_countries,
DROP COLUMN IF EXISTS top_keywords,
DROP COLUMN IF EXISTS category_rank;

COMMIT;