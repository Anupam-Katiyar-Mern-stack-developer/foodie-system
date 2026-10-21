import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import pg from "pg";
import pool from "../config/database.js";
import { placeOrderService } from "../services/order.service.js";
import { completeDeliveryOrderService } from "../services/delivery.service.js";
import { hashDeliveryOtp } from "../utils/deliveryOtp.js";
import {
  getCheckoutQuoteService,
  priceRestaurantGroups,
  defaultSiteSettings,
  saveSiteSettingsService,
  siteSettingsSchema,
} from "../services/setting.service.js";
import {
  createPaymentService,
  verifyPaymentService,
  processPaymentWebhook,
  signaturesMatch,
  paymentConfigured,
  reconcilePaymentService,
} from "../services/payment.service.js";

test("pricing allocates discounts in paise and keeps restaurant totals equal to checkout", () => {
  const result = priceRestaurantGroups(
    [{ subtotal: 100 }, { subtotal: 200 }],
    { ...defaultSiteSettings, deliveryFee: 20, taxPercent: 10 },
    30
  );
  assert.equal(result.grandTotal, 337);
  assert.equal(
    result.groups.reduce((sum, g) => sum + g.discountAmount, 0),
    30
  );
  assert.equal(
    result.groups.reduce((sum, g) => sum + g.totalAmount, 0),
    result.grandTotal
  );
  assert.equal(
    priceRestaurantGroups([{ subtotal: 300 }], {
      ...defaultSiteSettings,
      deliveryFee: 20,
      freeDeliveryAbove: 250,
    }).deliveryFee,
    0
  );
});

test("settings reject script URLs and disabling every payment method", () => {
  assert.equal(
    siteSettingsSchema.safeParse({
      ...defaultSiteSettings,
      logo: "javascript:alert(1)",
    }).success,
    false
  );
  assert.equal(
    siteSettingsSchema.safeParse({
      ...defaultSiteSettings,
      codEnabled: false,
      onlineEnabled: false,
    }).success,
    false
  );
  assert.equal(signaturesMatch("a".repeat(64), "a".repeat(64)), true);
  assert.equal(signaturesMatch("a".repeat(64), "short"), false);
});

test("isolated database: coupons, checkout retries, signatures, capture and webhook replay", async (t) => {
  const schema = `foodie_test_${crypto.randomBytes(8).toString("hex")}`;
  const admin = new pg.Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionTimeoutMillis: 5000,
  });
  const previous = {
    key: process.env.RAZORPAY_KEY_ID,
    secret: process.env.RAZORPAY_KEY_SECRET,
    webhook: process.env.RAZORPAY_WEBHOOK_SECRET,
  };
  const originalFetch = globalThis.fetch;
  let connected = false;
  try {
    await admin.connect();
    connected = true;
    if (!/^foodie_test_[a-f0-9]+$/.test(schema))
      throw new Error("Invalid test schema");
    await admin.query(`CREATE SCHEMA ${schema}`);
    pool.options.options = `-c search_path=${schema}`;
    const create = `
      CREATE TABLE admins(id BIGINT PRIMARY KEY);
      CREATE TABLE users(id BIGINT PRIMARY KEY,name TEXT,email TEXT,phone TEXT);
      CREATE TABLE addresses(id BIGINT PRIMARY KEY,user_id BIGINT,address_line TEXT,landmark TEXT,city TEXT,state TEXT,pincode TEXT,latitude NUMERIC,longitude NUMERIC);
      CREATE TABLE restaurants(id BIGINT PRIMARY KEY,restaurant_name TEXT,slug TEXT,is_open BOOLEAN,is_blocked BOOLEAN,approval_status TEXT);
      CREATE TABLE categories(id BIGINT PRIMARY KEY,is_active BOOLEAN);
      CREATE TABLE foods(id BIGINT PRIMARY KEY,restaurant_id BIGINT,category_id BIGINT,name TEXT,slug TEXT,image TEXT,price NUMERIC,discount_price NUMERIC,is_available BOOLEAN);
      CREATE TABLE carts(id BIGSERIAL PRIMARY KEY,user_id BIGINT);
      CREATE TABLE cart_items(id BIGSERIAL PRIMARY KEY,cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,food_id BIGINT,quantity INTEGER,created_at TIMESTAMPTZ DEFAULT NOW());
      INSERT INTO admins VALUES(1);
      INSERT INTO users VALUES(1,'Test buyer','buyer@example.test','9000000000');
      INSERT INTO addresses VALUES(1,1,'Test address',NULL,'Kanpur','UP','208027',26.4,80.3);
      INSERT INTO restaurants VALUES(1,'Kitchen A','a',TRUE,FALSE,'APPROVED'),(2,'Kitchen B','b',TRUE,FALSE,'APPROVED');
      INSERT INTO categories VALUES(1,TRUE);
      INSERT INTO foods VALUES(1,1,1,'Dish A','dish-a','/images/a.jpg',100,NULL,TRUE),(2,2,1,'Dish B','dish-b','/images/b.jpg',200,NULL,TRUE);
    `;
    await pool.query(create);
    await pool.query(
      await fs.readFile(
        new URL(
          "../database/migrations/012_create_orders.sql",
          import.meta.url
        ),
        "utf8"
      )
    );
    await pool.query(
      await fs.readFile(
        new URL(
          "../database/migrations/017_site_settings_payments.sql",
          import.meta.url
        ),
        "utf8"
      )
    );
    await pool.query(`CREATE TABLE delivery_agents(id BIGINT PRIMARY KEY,public_id TEXT,name TEXT,approval_status TEXT,is_online BOOLEAN,is_blocked BOOLEAN,is_available BOOLEAN,updated_at TIMESTAMPTZ);
      INSERT INTO delivery_agents VALUES(1,'rider-test','Test rider','APPROVED',TRUE,FALSE,FALSE,NOW());
      ALTER TABLE orders ADD COLUMN assigned_delivery_agent_id BIGINT,ADD COLUMN delivery_otp_hash TEXT,ADD COLUMN delivery_otp_expires_at TIMESTAMPTZ,
      ADD COLUMN delivery_otp_attempts INTEGER DEFAULT 0,ADD COLUMN delivery_otp_verified_at TIMESTAMPTZ,ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;`);
    await saveSiteSettingsService(
      { ...defaultSiteSettings, deliveryFee: 20, taxPercent: 10 },
      1
    );
    await pool.query(
      "INSERT INTO coupons(code,title,discount_type,discount_value,min_order) VALUES('TEST10','Ten percent','PERCENT',10,100)"
    );
    const refill = async () => {
      const cart = (
        await pool.query("INSERT INTO carts(user_id) VALUES(1) RETURNING id")
      ).rows[0];
      await pool.query(
        "INSERT INTO cart_items(cart_id,food_id,quantity) VALUES($1,1,1),($1,2,1)",
        [cart.id]
      );
    };
    await refill();
    assert.equal((await getCheckoutQuoteService(1, "TEST10")).grandTotal, 337);
    await assert.rejects(
      () =>
        placeOrderService({
          userId: 1,
          addressId: 1,
          paymentMethod: "COD",
          couponCode: "TEST10",
          requestKey: "wrong-total-test",
          expectedTotal: 1,
        }),
      /total changed/
    );
    const cod = await placeOrderService({
      userId: 1,
      addressId: 1,
      paymentMethod: "COD",
      couponCode: "TEST10",
      requestKey: "cod-test-123",
      latitude: 26.5,
      longitude: 80.4,
    });
    assert.equal(cod.grandTotal, 337);
    assert.equal(cod.orders.length, 2);
    assert.equal(
      (await pool.query("SELECT COUNT(*)::int AS n FROM order_email_outbox"))
        .rows[0].n,
      1
    );
    assert.equal(
      Number(
        (
          await pool.query(
            "SELECT latitude FROM order_groups WHERE checkout_number=$1",
            [cod.checkoutNumber]
          )
        ).rows[0].latitude
      ),
      26.5
    );
    assert.equal(
      (
        await placeOrderService({
          userId: 1,
          addressId: 1,
          paymentMethod: "COD",
          requestKey: "cod-test-123",
        })
      ).replayed,
      true
    );
    assert.equal(
      (await pool.query("SELECT COUNT(*)::int AS n FROM coupon_redemptions"))
        .rows[0].n,
      1
    );
    await pool.query(
      "UPDATE orders SET assigned_delivery_agent_id=1,status='OUT_FOR_DELIVERY',delivery_otp_hash=$1,delivery_otp_expires_at=NOW()+interval '5 minutes' WHERE order_group_id=(SELECT id FROM order_groups WHERE checkout_number=$2)",
      [hashDeliveryOtp("123456"), cod.checkoutNumber]
    );
    await assert.rejects(
      () =>
        completeDeliveryOrderService({
          deliveryAgentId: 1,
          orderNumber: cod.orders[0].orderNumber,
          otp: "123456",
        }),
      /cash collection/
    );
    await completeDeliveryOrderService({
      deliveryAgentId: 1,
      orderNumber: cod.orders[0].orderNumber,
      otp: "123456",
      cashCollected: true,
    });
    assert.equal(
      (
        await pool.query(
          "SELECT payment_status FROM order_groups WHERE checkout_number=$1",
          [cod.checkoutNumber]
        )
      ).rows[0].payment_status,
      "PENDING"
    );
    await completeDeliveryOrderService({
      deliveryAgentId: 1,
      orderNumber: cod.orders[1].orderNumber,
      otp: "123456",
      cashCollected: true,
    });
    assert.equal(
      (
        await pool.query(
          "SELECT payment_status FROM order_groups WHERE checkout_number=$1",
          [cod.checkoutNumber]
        )
      ).rows[0].payment_status,
      "PAID"
    );
    await refill();
    await assert.rejects(
      () => getCheckoutQuoteService(1, "TEST10"),
      /usage limit/
    );
    const online = await placeOrderService({
      userId: 1,
      addressId: 1,
      paymentMethod: "ONLINE",
      requestKey: "online-test-123",
    });
    assert.equal(
      online.orders.every((o) => o.status === "PAYMENT_PENDING"),
      true
    );
    process.env.RAZORPAY_KEY_ID = "rzp_test_UnitTest123";
    process.env.RAZORPAY_KEY_SECRET = "unit_test_secret";
    process.env.RAZORPAY_WEBHOOK_SECRET = "unit_webhook_secret";
    let gatewayOrderCalls = 0;
    let amount = 0;
    let gatewayStatus = "authorized";
    globalThis.fetch = async (url, options) => {
      if (String(url).endsWith("/orders")) {
        gatewayOrderCalls++;
        amount = JSON.parse(options.body).amount;
        return {
          ok: true,
          json: async () => ({ id: "order_Test123", amount, currency: "INR" }),
        };
      }
      if (String(url).endsWith("/payments/pay_Test123"))
        return {
          ok: true,
          json: async () => ({
            id: "pay_Test123",
            order_id: "order_Test123",
            amount,
            currency: "INR",
            status: gatewayStatus,
          }),
        };
      if (String(url).endsWith("/orders/order_Test123/payments"))
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "pay_Test123",
                order_id: "order_Test123",
                amount,
                currency: "INR",
                status: gatewayStatus,
              },
            ],
          }),
        };
      throw new Error("Unexpected external request in test");
    };
    await assert.rejects(
      () => createPaymentService(999, online.checkoutNumber),
      /not found/
    );
    await createPaymentService(1, online.checkoutNumber);
    await createPaymentService(1, online.checkoutNumber);
    assert.equal(gatewayOrderCalls, 1);
    await assert.rejects(
      () =>
        verifyPaymentService(1, {
          checkoutNumber: online.checkoutNumber,
          razorpay_payment_id: "pay_Test123",
          razorpay_signature: "0".repeat(64),
        }),
      /signature/
    );
    assert.equal(
      (
        await pool.query(
          "SELECT payment_status FROM order_groups WHERE checkout_number=$1",
          [online.checkoutNumber]
        )
      ).rows[0].payment_status,
      "PENDING"
    );
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update("order_Test123|pay_Test123")
      .digest("hex");
    await assert.rejects(
      () =>
        verifyPaymentService(1, {
          checkoutNumber: online.checkoutNumber,
          razorpay_payment_id: "pay_Test123",
          razorpay_signature: signature,
        }),
      /not captured/
    );
    gatewayStatus = "captured";
    assert.equal(
      (await reconcilePaymentService(1, online.checkoutNumber)).paymentStatus,
      "PAID"
    );
    const verified = await verifyPaymentService(1, {
      checkoutNumber: online.checkoutNumber,
      razorpay_payment_id: "pay_Test123",
      razorpay_signature: signature,
    });
    assert.equal(verified.paymentStatus, "PAID");
    const statuses = (
      await pool.query(
        "SELECT status FROM orders o JOIN order_groups og ON og.id=o.order_group_id WHERE og.checkout_number=$1",
        [online.checkoutNumber]
      )
    ).rows;
    assert.equal(
      statuses.every((o) => o.status === "PLACED"),
      true
    );
    const event = Buffer.from(
      JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "pay_Test123",
              order_id: "order_Test123",
              amount,
              currency: "INR",
              status: "captured",
            },
          },
        },
      })
    );
    const webhookSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(event)
      .digest("hex");
    await assert.rejects(
      () => processPaymentWebhook(event, "0".repeat(64), "bad-event"),
      /signature/
    );
    await processPaymentWebhook(event, webhookSignature, "test-event-1");
    assert.equal(
      (await processPaymentWebhook(event, webhookSignature, "test-event-1"))
        .alreadyProcessed,
      true
    );
    assert.equal(
      (await pool.query("SELECT COUNT(*)::int AS n FROM order_email_outbox"))
        .rows[0].n,
      2
    );
    const tampered = Buffer.from(
      JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "pay_Test123",
              order_id: "order_Test123",
              amount: 1,
              currency: "INR",
              status: "captured",
            },
          },
        },
      })
    );
    const tamperedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(tampered)
      .digest("hex");
    await assert.rejects(
      () => processPaymentWebhook(tampered, tamperedSig, "test-event-2"),
      /amount/
    );
    process.env.RAZORPAY_KEY_ID = "rzp_test_REPLACE_WITH_YOUR_KEY";
    assert.equal(paymentConfigured(), false);
    t.diagnostic(
      "No real payment or customer data was created; external payment calls were mocked only inside this test."
    );
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name, value] of Object.entries({
      RAZORPAY_KEY_ID: previous.key,
      RAZORPAY_KEY_SECRET: previous.secret,
      RAZORPAY_WEBHOOK_SECRET: previous.webhook,
    })) {
      if (value == null) delete process.env[name];
      else process.env[name] = value;
    }
    await pool.end();
    if (connected) {
      await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
      await admin.end();
    }
  }
});
