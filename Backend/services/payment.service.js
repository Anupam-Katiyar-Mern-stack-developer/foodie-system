import crypto from "crypto";
import pool from "../config/database.js";
import { queueOrderEmail } from "./notification.service.js";
import { getSiteSettingsService } from "./setting.service.js";
import {
  emitOrderStatusUpdate,
  emitNewRestaurantOrder,
  emitPaymentUpdate,
} from "../socket/order.socket.js";

const fail = (message, statusCode = 400) =>
  Object.assign(new Error(message), { statusCode });
export const paymentConfigured = () =>
  Boolean(
    /^rzp_(test|live)_[A-Za-z0-9]+$/.test(process.env.RAZORPAY_KEY_ID || "") &&
      process.env.RAZORPAY_KEY_SECRET &&
      !/placeholder|your_|replace|example/i.test(
        `${process.env.RAZORPAY_KEY_ID} ${process.env.RAZORPAY_KEY_SECRET}`
      )
  );

export const razorpayRequest = async (path, method = "GET", body) => {
  if (!paymentConfigured())
    throw fail(
      "Online payment is not configured. Add valid Razorpay test keys to the backend environment.",
      503
    );
  let response;
  try {
    response = await fetch(`https://api.razorpay.com/v1/${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw fail(
      "Payment gateway is temporarily unavailable. Your order can be retried from My Orders.",
      503
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw fail(
      "Payment gateway returned an invalid response. Please retry.",
      502
    );
  }
  if (!response.ok) {
    console.error(
      "Razorpay request failed:",
      response.status,
      data.error?.code
    );
    throw fail(
      "Payment gateway rejected the request. Check gateway keys, settings and dashboard.",
      502
    );
  }
  return data;
};

export const signaturesMatch = (expected, actual) => {
  if (typeof actual !== "string" || !/^[a-f0-9]{64}$/i.test(actual))
    return false;
  const a = Buffer.from(expected, "hex"),
    b = Buffer.from(actual, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const createPaymentService = async (userId, checkoutNumber) => {
  if (!paymentConfigured())
    throw fail("Add valid Razorpay test keys to enable online payments.", 503);
  const settings = await getSiteSettingsService();
  if (!settings.onlineEnabled)
    throw fail("Online payments are currently disabled", 409);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT * FROM order_groups WHERE checkout_number=$1 AND user_id=$2 FOR UPDATE",
      [checkoutNumber, userId]
    );
    const group = rows[0];
    if (!group) throw fail("Checkout not found", 404);
    if (group.payment_method !== "ONLINE")
      throw fail("This checkout uses cash on delivery", 409);
    if (group.payment_status === "PAID")
      throw fail("Checkout is already paid", 409);
    const pending = await client.query(
      "SELECT id FROM orders WHERE order_group_id=$1 AND status='PAYMENT_PENDING' LIMIT 1",
      [group.id]
    );
    if (!pending.rows.length)
      throw fail("Checkout is not awaiting payment", 409);
    const amount = Math.round(Number(group.grand_total) * 100);
    if (!Number.isSafeInteger(amount) || amount < 100)
      throw fail("Invalid checkout amount");
    await client.query(
      "INSERT INTO payments(order_group_id,amount_paise) VALUES($1,$2) ON CONFLICT(order_group_id) DO NOTHING",
      [group.id, amount]
    );
    const existing = (
      await client.query(
        "SELECT * FROM payments WHERE order_group_id=$1 FOR UPDATE",
        [group.id]
      )
    ).rows[0];
    let gatewayOrderId = existing.razorpay_order_id;
    if (!gatewayOrderId) {
      const gateway = await razorpayRequest("orders", "POST", {
        amount,
        currency: "INR",
        receipt: group.checkout_number.slice(0, 40),
        notes: { checkoutNumber: group.checkout_number },
      });
      if (gateway.amount !== amount || gateway.currency !== "INR")
        throw fail("Payment amount mismatch", 502);
      gatewayOrderId = gateway.id;
      await client.query(
        "UPDATE payments SET razorpay_order_id=$1,updated_at=NOW() WHERE id=$2",
        [gatewayOrderId, existing.id]
      );
    }
    const user = (
      await client.query("SELECT name,email,phone FROM users WHERE id=$1", [
        userId,
      ])
    ).rows[0];
    await client.query("COMMIT");
    return {
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: gatewayOrderId,
      amount,
      currency: "INR",
      checkoutNumber: group.checkout_number,
      siteName: settings.siteName,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || "",
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const captureVerifiedPayment = async (
  gatewayPayment,
  eventId = null,
  eventType = "payment.captured"
) => {
  if (gatewayPayment.status !== "captured")
    throw fail("Payment is not captured yet. Retry verification shortly.", 409);
  const client = await pool.connect();
  let orders = [];
  let changed = false;
  try {
    await client.query("BEGIN");
    const found = await client.query(
      `SELECT p.*,og.checkout_number,og.payment_status FROM payments p JOIN order_groups og ON og.id=p.order_group_id WHERE p.razorpay_order_id=$1 FOR UPDATE OF og,p`,
      [gatewayPayment.order_id]
    );
    const payment = found.rows[0];
    if (!payment) throw fail("Payment order not found", 404);
    if (payment.status === "REFUNDED" || payment.payment_status === "REFUNDED")
      throw fail("This checkout has already been refunded", 409);
    if (
      Number(payment.amount_paise) !== gatewayPayment.amount ||
      payment.currency !== gatewayPayment.currency
    )
      throw fail("Payment amount or currency mismatch", 409);
    if (
      payment.razorpay_payment_id &&
      payment.razorpay_payment_id !== gatewayPayment.id
    )
      throw fail("Checkout already has a different payment", 409);
    if (eventId) {
      const inserted = await client.query(
        "INSERT INTO payment_webhook_events(event_id,event_type) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING event_id",
        [eventId, eventType]
      );
      if (!inserted.rows.length) {
        await client.query("COMMIT");
        return {
          checkoutNumber: payment.checkout_number,
          alreadyProcessed: true,
        };
      }
    }
    await client.query(
      "UPDATE payments SET status='CAPTURED',razorpay_payment_id=$1,updated_at=NOW() WHERE id=$2",
      [gatewayPayment.id, payment.id]
    );
    await client.query(
      "UPDATE order_groups SET payment_status='PAID',updated_at=NOW() WHERE id=$1",
      [payment.order_group_id]
    );
    changed = payment.payment_status !== "PAID";
    const placed = await client.query(
      `UPDATE orders SET status='PLACED',updated_at=NOW() WHERE order_group_id=$1 AND status='PAYMENT_PENDING' RETURNING order_number AS "orderNumber",restaurant_id AS "restaurantId",status,total_amount AS "totalAmount"`,
      [payment.order_group_id]
    );
    orders = placed.rows;
    const settings = await getSiteSettingsService(client);
    if (settings.orderEmailsEnabled)
      await queueOrderEmail(client, payment.order_group_id);
    await client.query("COMMIT");
    if (changed) {
      const allOrders = await pool.query(
        'SELECT order_number AS "orderNumber" FROM orders WHERE order_group_id=$1',
        [payment.order_group_id]
      );
      for (const order of allOrders.rows) {
        try {
          emitPaymentUpdate({
            orderNumber: order.orderNumber,
            paymentMethod: "ONLINE",
            paymentStatus: "PAID",
          });
        } catch {
          /* REST remains authoritative. */
        }
      }
      for (const order of orders) {
        try {
          emitNewRestaurantOrder({ restaurantId: order.restaurantId, order });
          emitOrderStatusUpdate({
            orderNumber: order.orderNumber,
            status: "PLACED",
          });
        } catch {
          /* Reconnect reload recovers missed events. */
        }
      }
    }
    return { checkoutNumber: payment.checkout_number, paymentStatus: "PAID" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Capture authorized money only after matching it to our stored checkout.
export const ensureCapturedPayment = async (payment) => {
  if (payment.status !== "authorized") return payment;
  const { rows } = await pool.query(
    `SELECT p.amount_paise,p.currency,p.status,og.payment_status,og.grand_total,
    EXISTS(SELECT 1 FROM orders o WHERE o.order_group_id=og.id AND o.status='PAYMENT_PENDING') AS awaiting
    FROM payments p JOIN order_groups og ON og.id=p.order_group_id WHERE p.razorpay_order_id=$1`,
    [payment.order_id]
  );
  const stored = rows[0];
  if (
    !stored ||
    !stored.awaiting ||
    ["REFUNDED", "PAID"].includes(stored.payment_status) ||
    stored.status === "REFUNDED"
  )
    throw fail("Checkout is not awaiting capture", 409);
  if (
    Number(stored.amount_paise) !== payment.amount ||
    Math.round(Number(stored.grand_total) * 100) !== payment.amount ||
    stored.currency !== payment.currency
  )
    throw fail("Payment amount or currency mismatch", 409);
  let captured;
  try {
    captured = await razorpayRequest(
      `payments/${encodeURIComponent(payment.id)}/capture`,
      "POST",
      { amount: Number(stored.amount_paise), currency: stored.currency }
    );
  } catch (error) {
    // Another callback, worker or dashboard may have captured it concurrently.
    const latest = await razorpayRequest(
      `payments/${encodeURIComponent(payment.id)}`
    );
    if (latest.status !== "captured")
      throw fail(
        "Payment is not captured yet. Retry verification shortly.",
        409
      );
    captured = latest;
  }
  if (
    captured.id !== payment.id ||
    captured.order_id !== payment.order_id ||
    captured.amount !== payment.amount ||
    captured.currency !== payment.currency
  )
    throw fail("Gateway capture response mismatch", 502);
  return captured;
};

export const reconcilePaymentService = async (userId, checkoutNumber) => {
  const { rows } = await pool.query(
    `SELECT og.payment_status AS "paymentStatus",p.razorpay_order_id
    FROM order_groups og LEFT JOIN payments p ON p.order_group_id=og.id
    WHERE og.user_id=$1 AND og.checkout_number=$2`,
    [userId, checkoutNumber]
  );
  const payment = rows[0];
  if (!payment) throw fail("Checkout not found", 404);
  if (payment.paymentStatus === "PAID" || !payment.razorpay_order_id)
    return { checkoutNumber, paymentStatus: payment.paymentStatus };
  const gateway = await razorpayRequest(
    `orders/${encodeURIComponent(payment.razorpay_order_id)}/payments`
  );
  const candidates = (gateway.items || []).filter(
    (item) => item.order_id === payment.razorpay_order_id
  );
  const captured =
    candidates.find((item) => item.status === "captured") ||
    candidates.find((item) => item.status === "authorized");
  return captured
    ? captureVerifiedPayment(await ensureCapturedPayment(captured))
    : { checkoutNumber, paymentStatus: payment.paymentStatus };
};

export const verifyPaymentService = async (userId, input) => {
  const {
    checkoutNumber,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = input;
  if (typeof paymentId !== "string" || !/^pay_[A-Za-z0-9]+$/.test(paymentId))
    throw fail("Invalid payment reference");
  const { rows } = await pool.query(
    `SELECT p.razorpay_order_id FROM payments p JOIN order_groups og ON og.id=p.order_group_id WHERE og.user_id=$1 AND og.checkout_number=$2`,
    [userId, checkoutNumber]
  );
  if (!rows[0]?.razorpay_order_id) throw fail("Payment order not found", 404);
  if (!paymentConfigured())
    throw fail("Payment gateway is not configured", 503);
  const orderId = rows[0].razorpay_order_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (!signaturesMatch(expected, signature))
    throw fail("Payment signature verification failed");
  const payment = await razorpayRequest(`payments/${paymentId}`);
  if (payment.order_id !== orderId)
    throw fail("Payment belongs to a different checkout");
  return captureVerifiedPayment(await ensureCapturedPayment(payment));
};

export const processPaymentWebhook = async (raw, signature, eventId) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || /placeholder|your_|replace/i.test(secret))
    throw fail("Webhook secret is not configured", 503);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");
  if (!signaturesMatch(expected, signature))
    throw fail("Invalid webhook signature");
  let event;
  try {
    event = JSON.parse(raw.toString("utf8"));
  } catch {
    throw fail("Invalid webhook body");
  }
  const payment = event.payload?.payment?.entity;
  const id = eventId || crypto.createHash("sha256").update(raw).digest("hex");
  if (event.event === "payment.captured" && payment)
    return captureVerifiedPayment(payment, id, event.event);
  // Failure and authorization events must never overwrite a captured payment.
  if (
    payment?.order_id &&
    ["payment.failed", "payment.authorized"].includes(event.event)
  ) {
    await pool.query(
      "UPDATE payments SET status=$1,updated_at=NOW() WHERE razorpay_order_id=$2 AND status NOT IN ('CAPTURED','REFUNDED')",
      [
        event.event === "payment.failed" ? "FAILED" : "AUTHORIZED",
        payment.order_id,
      ]
    );
  }
  return { received: true };
};

// Recovery when a browser closes before the checkout callback; webhook is optional.
export const reconcilePendingPaymentsService = async () => {
  if (!paymentConfigured()) return { checked: 0 };
  const { rows } =
    await pool.query(`SELECT p.id,og.user_id,og.checkout_number FROM payments p JOIN order_groups og ON og.id=p.order_group_id
    WHERE og.payment_method='ONLINE' AND og.payment_status='PENDING' AND p.status IN ('CREATED','AUTHORIZED','FAILED') AND p.razorpay_order_id IS NOT NULL
    AND p.updated_at<=NOW()-INTERVAL '30 seconds' AND EXISTS(SELECT 1 FROM orders o WHERE o.order_group_id=og.id AND o.status='PAYMENT_PENDING')
    ORDER BY p.updated_at,p.id LIMIT 5`);
  await Promise.allSettled(
    rows.map(async (row) => {
      await pool.query("UPDATE payments SET updated_at=NOW() WHERE id=$1", [
        row.id,
      ]);
      try {
        await reconcilePaymentService(row.user_id, row.checkout_number);
      } catch (error) {
        console.error("Payment recovery:", row.checkout_number, error.message);
      }
    })
  );
  return { checked: rows.length };
};
