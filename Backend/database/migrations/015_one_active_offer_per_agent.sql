CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_offer_per_delivery_agent
ON delivery_assignments(delivery_agent_id)
WHERE status = 'OFFERED';