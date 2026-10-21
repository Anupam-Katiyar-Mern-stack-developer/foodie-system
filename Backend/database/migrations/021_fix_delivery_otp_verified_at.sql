DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'orders'
          AND column_name = 'delivery_otp_veriefied_at'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'orders'
          AND column_name = 'delivery_otp_verified_at'
    ) THEN
        ALTER TABLE orders
        RENAME COLUMN delivery_otp_veriefied_at TO delivery_otp_verified_at;
    END IF;
END $$;
