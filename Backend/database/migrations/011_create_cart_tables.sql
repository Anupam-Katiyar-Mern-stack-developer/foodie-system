CREATE TABLE IF NOT EXISTS carts(
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_carts_user 
       FOREIGN KEY (user_id)
       REFERENCES users(id)
       ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items(
    id BIGSERIAL PRIMARY KEY,

    cart_id BIGINT NOT NULL,
    food_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    craeted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_items_cart
       FOREIGN KEY (cart_id)
       REFERENCES carts(id)
       ON DELETE CASCADE,

      CONSTRAINT fk_cart_items_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE,

        CONSTRAINT unique_cart_food
           UNIQUE(cart_id,food_id),

           CONSTRAINT unique_cart_item_quantity

            CHECK(
                quantity >=1
                AND quantity <=20
            )

);

CREATE INDEX IF NOT EXISTS idx_cart_items_food_id
ON cart_items(food_id);