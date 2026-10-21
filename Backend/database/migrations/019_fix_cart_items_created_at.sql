-- Preserve existing cart timestamps while correcting the legacy column name.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'cart_items' AND column_name = 'craeted_at'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'cart_items' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE cart_items RENAME COLUMN craeted_at TO created_at;
    END IF;
END $$;
