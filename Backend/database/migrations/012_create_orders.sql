CREATE TABLE IF NOT EXISTS order_groups (
    id BIGSERIAL PRIMARY KEY,

    checkout_number VARCHAR(50) UNIQUE NOT NULL,

    user_id BIGINT NOT NULL,

    delivery_name VARCHAR(100) NOT NULL,
    delivery_phone VARCHAR(15) NOT NULL,

    address_line VARCHAR(255) NOT NULL,
    landmark VARCHAR(150),

    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,

    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    payment_method VARCHAR(30) NOT NULL DEFAULT 'COD',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_groups_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT check_order_group_payment_method
        CHECK (
            payment_method IN (
                'COD',
                'ONLINE'
            )
        ),

    CONSTRAINT check_order_group_payment_status
        CHECK (
            payment_status IN (
                'PENDING',
                'PAID',
                'FAILED',
                'REFUNDED'
            )
        ),

    CONSTRAINT check_order_group_total
        CHECK (grand_total >= 0)
);


CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,

    order_group_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,

    order_number VARCHAR(50) UNIQUE NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',

    subtotal NUMERIC(12,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,

    rejection_reason TEXT,
    cancelled_reason TEXT,

    confirmed_at TIMESTAMPTZ,
    preparing_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_group
        FOREIGN KEY (order_group_id)
        REFERENCES order_groups(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orders_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurants(id)
        ON DELETE RESTRICT,

    CONSTRAINT check_order_status
        CHECK (
            status IN (
                'PLACED',
                'CONFIRMED',
                'PREPARING',
                'READY_FOR_PICKUP',
                'DELIVERY_ASSIGNED',
                'PICKED_UP',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'REJECTED',
                'CANCELLED'
            )
        ),

    CONSTRAINT check_order_subtotal
        CHECK (subtotal >= 0),

    CONSTRAINT check_order_delivery_fee
        CHECK (delivery_fee >= 0),

    CONSTRAINT check_order_tax
        CHECK (tax_amount >= 0),

    CONSTRAINT check_order_total
        CHECK (total_amount >= 0)
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,

    food_id BIGINT,

    food_name VARCHAR(150) NOT NULL,
    food_slug VARCHAR(220) NOT NULL,

    food_image TEXT,

    unit_price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL,

    item_total NUMERIC(12,2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_food
        FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE SET NULL,

    CONSTRAINT check_order_item_price
        CHECK (unit_price >= 0),

    CONSTRAINT check_order_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT check_order_item_total
        CHECK (item_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_groups_user_id
ON order_groups(user_id);


CREATE INDEX IF NOT EXISTS idx_orders_group_id
ON orders(order_group_id);


CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id
ON orders(restaurant_id);


CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(status);


CREATE INDEX IF NOT EXISTS idx_order_items_order_id
ON order_items(order_id);