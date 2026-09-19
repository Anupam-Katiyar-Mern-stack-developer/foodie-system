CREATE TABLE IF NOT EXISTS foods(
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    discount_price NUMERIC(10,2),
    image TEXT NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    preparation_time INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_food_restaurant

       FOREIGN KEY(restaurant_id)
       REFERENCES restaurants(id)
       ON DELETE CASCADE,

    CONSTRAINT fk_food_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT check_food_price
       CHECK(price > 0),

    CONSTRAINT check_food_discount_price
       CHECK(
        discount_price IS NULL
        OR(
         discount_price > 0
         AND discount_price <price
        )
       
       ),

       CONSTRAINT check_food_preparation_time
        CHECK (
            preparation_time IS NULL
            OR preparation_time > 0
        )

);