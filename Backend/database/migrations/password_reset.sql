CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,

  account_type VARCHAR(30) NOT NULL
    CHECK (
      account_type IN (
        'USER',
        'RESTAURANT',
        'DELIVERY_AGENT',
        'ADMIN'
      )
    ),

  account_id BIGINT NOT NULL,

  token_hash VARCHAR(64) NOT NULL UNIQUE,

  expires_at TIMESTAMPTZ NOT NULL,

  used_at TIMESTAMPTZ DEFAULT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_account
ON password_reset_tokens(account_type, account_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_expires
ON password_reset_tokens(expires_at);