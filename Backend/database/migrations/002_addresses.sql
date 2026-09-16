CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY ,
    user_id BIGINT NOT NULL,
    label VARCHAR(30) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    landmark VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,

    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    is_default BOOLEAN NOT NULL DEFAULT  FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_address_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
);