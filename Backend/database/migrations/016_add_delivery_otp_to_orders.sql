alter table orders 
add column if not exists out_for_delivery_at timestamptz;

alter table orders
add column if not exists delivery_otp_hash text;

alter table orders 
add column if not exists delivery_otp_expires_at timestamptz;

alter table orders 
add column if not exists delivery_otp_attempts integer not null default 0;

alter table orders 
add column if not exists delivery_otp_veriefied_at timestamptz;