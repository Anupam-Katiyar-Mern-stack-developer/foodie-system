BEGIN;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
CREATE TABLE IF NOT EXISTS email_verifications (
  account_kind VARCHAR(20) NOT NULL CHECK(account_kind IN ('user','restaurant','delivery','admin')),
  account_id BIGINT NOT NULL,
  email TEXT NOT NULL,
  code_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempts INTEGER NOT NULL DEFAULT 0,
  send_count INTEGER NOT NULL DEFAULT 1,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(account_kind,account_id)
);
CREATE OR REPLACE FUNCTION reset_changed_email_verification() RETURNS trigger AS $$
DECLARE kind TEXT;
BEGIN
  IF LOWER(TRIM(NEW.email)) IS DISTINCT FROM LOWER(TRIM(OLD.email)) THEN
    NEW.email_verified := FALSE;
    kind := CASE TG_TABLE_NAME WHEN 'users' THEN 'user' WHEN 'restaurants' THEN 'restaurant' WHEN 'delivery_agents' THEN 'delivery' ELSE 'admin' END;
    UPDATE email_verifications SET expires_at=NOW(),attempts=5 WHERE account_kind=kind AND account_id=NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS email_verification_reset ON users;
CREATE TRIGGER email_verification_reset BEFORE UPDATE OF email ON users FOR EACH ROW EXECUTE FUNCTION reset_changed_email_verification();
DROP TRIGGER IF EXISTS email_verification_reset ON restaurants;
CREATE TRIGGER email_verification_reset BEFORE UPDATE OF email ON restaurants FOR EACH ROW EXECUTE FUNCTION reset_changed_email_verification();
DROP TRIGGER IF EXISTS email_verification_reset ON delivery_agents;
CREATE TRIGGER email_verification_reset BEFORE UPDATE OF email ON delivery_agents FOR EACH ROW EXECUTE FUNCTION reset_changed_email_verification();
DROP TRIGGER IF EXISTS email_verification_reset ON admins;
CREATE TRIGGER email_verification_reset BEFORE UPDATE OF email ON admins FOR EACH ROW EXECUTE FUNCTION reset_changed_email_verification();
COMMIT;
