CREATE TABLE IF NOT EXISTS delivery_agents (
    id BIGSERIAL PRIMARY KEY,

    public_id VARCHAR(100) UNIQUE NOT NULL,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    image TEXT,

    vehicle_type VARCHAR(50),
    vehicle_number VARCHAR(50),

    address TEXT,

    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,

    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_delivery_agent_approval_status
        CHECK (
            approval_status IN (
                'PENDING',
                'APPROVED',
                'REJECTED',
                'SUSPENDED'
            )
        )
);


CREATE INDEX IF NOT EXISTS idx_delivery_agents_availability
ON delivery_agents (
    approval_status,
    is_online,
    is_available,
    is_blocked
);


CREATE INDEX IF NOT EXISTS idx_delivery_agents_location
ON delivery_agents (
    latitude,
    longitude
);