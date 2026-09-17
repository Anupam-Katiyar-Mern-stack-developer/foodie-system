ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS slug VARCHAR(220);


UPDATE restaurants
SET slug =
    LOWER(
        TRIM(
            BOTH '-'
            FROM REGEXP_REPLACE(
                restaurant_name || '-' || city,
                '[^A-Za-z0-9]+',
                '-',
                'g'
            )
        )
    )
    || '-'
    || SUBSTRING(
        MD5(
            RANDOM()::TEXT ||
            CLOCK_TIMESTAMP()::TEXT
        ),
        1,
        8
    )
WHERE slug IS NULL;


CREATE UNIQUE INDEX IF NOT EXISTS
idx_restaurants_slug
ON restaurants(slug);