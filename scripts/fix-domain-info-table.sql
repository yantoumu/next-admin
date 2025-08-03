-- 修复 domain_info 表缺少 id 主键的问题
-- 执行前请确保已备份数据库

BEGIN;

-- 1. 先添加 id 列（不设置为主键，避免现有数据冲突）
ALTER TABLE domain_info 
ADD COLUMN id TEXT;

-- 2. 为现有记录生成唯一的 CUID
-- 使用 PostgreSQL 的 gen_random_uuid() 函数生成唯一标识符
UPDATE domain_info 
SET id = 'c' || replace(gen_random_uuid()::text, '-', '') 
WHERE id IS NULL;

-- 3. 设置 id 列为 NOT NULL
ALTER TABLE domain_info 
ALTER COLUMN id SET NOT NULL;

-- 4. 添加主键约束
ALTER TABLE domain_info 
ADD CONSTRAINT domain_info_pkey PRIMARY KEY (id);

-- 5. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_domain_info_id ON domain_info(id);

-- 6. 验证修复结果
SELECT 
  COUNT(*) as total_records,
  COUNT(DISTINCT id) as unique_ids,
  COUNT(CASE WHEN id IS NULL THEN 1 END) as null_ids
FROM domain_info;

COMMIT;

-- 如果出现错误，使用以下命令回滚：
-- ROLLBACK;