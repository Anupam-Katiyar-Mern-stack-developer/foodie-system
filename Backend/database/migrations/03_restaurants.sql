CREATE TABLE IF NOT EXISTS restaurants (
    id BIGSERIAL PRIMARY KEY,

    owner_name VARCHAR(100) NOT NULL,

    restaurant_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    phone VARCHAR(15) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    description TEXT,

    logo TEXT,
    banner TEXT,

    address_line VARCHAR(255) NOT NULL,

    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,

    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),

    opening_time TIME,
    closing_time TIME,

    is_open BOOLEAN NOT NULL DEFAULT FALSE,

    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_restaurant_approval_status
    CHECK (
        approval_status IN (
            'PENDING',
            'APPROVED',
            'REJECTED',
            'SUSPENDED'
        )
    )
);