ALTER TABLE delivery_agents
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
