ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS fk_categories_restaurant;

ALTER TABLE categories
DROP CONSTRAINT IF EXISTS unique_restaurant_category_slug;

ALTER TABLE categories
DROP COLUMN IF EXISTS restaurant_id;

CREATE UNIQUE INDEX IF NOT EXISTS 
idx_categories_slug
ON categories(slug);