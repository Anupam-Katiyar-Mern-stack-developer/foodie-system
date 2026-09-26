ALTER TABLE orders
ADD COLUMN IF NOT EXISTS assigned_delivery_agent_id BIGINT;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_assigned_at TIMESTAMPTZ;


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_orders_delivery_agent'
    ) THEN
        ALTER TABLE orders
        ADD CONSTRAINT fk_orders_delivery_agent
        FOREIGN KEY (assigned_delivery_agent_id)
        REFERENCES delivery_agents(id)
        ON DELETE SET NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS delivery_assignments (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,
    delivery_agent_id BIGINT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'OFFERED',

    offered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_assignment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_delivery_assignment_agent
        FOREIGN KEY (delivery_agent_id)
        REFERENCES delivery_agents(id)
        ON DELETE CASCADE,

    CONSTRAINT check_delivery_assignment_status
        CHECK (
            status IN (
                'OFFERED',
                'ACCEPTED',
                'REJECTED',
                'EXPIRED',
                'CANCELLED'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_orders_delivery_agent
ON orders(assigned_delivery_agent_id);


CREATE INDEX IF NOT EXISTS idx_delivery_assignments_order
ON delivery_assignments(order_id);


CREATE INDEX IF NOT EXISTS idx_delivery_assignments_agent
ON delivery_assignments(delivery_agent_id);


CREATE INDEX IF NOT EXISTS idx_delivery_assignments_status
ON delivery_assignments(status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_delivery_offer_per_order
ON delivery_assignments(order_id)
WHERE status = 'OFFERED';

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_accepted_delivery_agent_per_order
ON delivery_assignments(order_id)
WHERE status = 'ACCEPTED';