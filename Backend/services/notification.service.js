import pool from "../config/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import { emailLayout } from "../templates/common/emailLayout.js";
import { getSiteSettingsService } from "./setting.service.js";

export const queueOrderEmail = async (db, orderGroupId) => {
  await db.query(
    "INSERT INTO order_email_outbox(order_group_id) VALUES($1) ON CONFLICT DO NOTHING",
    [orderGroupId]
  );
};

export const processOrderEmails = async () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  )
    return;
  const settings = await getSiteSettingsService();
  if (!settings.orderEmailsEnabled) return;
  const claimed =
    await pool.query(`UPDATE order_email_outbox SET status='PROCESSING', attempts=attempts+1,
    available_at=NOW()+interval '5 minutes' WHERE order_group_id IN (
      SELECT order_group_id FROM order_email_outbox WHERE status<>'SENT' AND available_at<=NOW()
      ORDER BY available_at LIMIT 5 FOR UPDATE SKIP LOCKED
    ) RETURNING order_group_id,attempts`);
  for (const job of claimed.rows) {
    try {
      const result = await pool.query(
        `SELECT og.checkout_number,og.delivery_name,og.grand_total,og.payment_method,og.payment_status,
        u.email, string_agg(o.order_number,', ' ORDER BY o.id) AS orders
        FROM order_groups og JOIN users u ON u.id=og.user_id JOIN orders o ON o.order_group_id=og.id
        WHERE og.id=$1 GROUP BY og.id,u.email`,
        [job.order_group_id]
      );
      const order = result.rows[0];
      if (
        !order ||
        (order.payment_method === "ONLINE" && order.payment_status !== "PAID")
      )
        throw new Error("Order is not ready for confirmation");
      const frontend = (process.env.FRONTEND_URL || "http://localhost:5173")
        .split(",")[0]
        .trim();
      await sendEmail({
        fromName: settings.siteName,
        to: order.email,
        subject: `${settings.siteName}: order ${order.checkout_number} confirmed`,
        text: `Hi ${order.delivery_name}, your order ${order.orders} is confirmed. Total INR ${order.grand_total}. Payment: ${order.payment_method} / ${order.payment_status}.`,
        html: emailLayout({
          title: "Your order is confirmed",
          brandName: settings.siteName,
          greeting: `Hi ${order.delivery_name},`,
          message: `Thanks for ordering with ${settings.siteName}. Your restaurant has received your order.`,
          status: "Order placed",
          details: [
            { label: "Orders", value: order.orders },
            { label: "Total", value: `INR ${order.grand_total}` },
            {
              label: "Payment",
              value: `${order.payment_method} · ${order.payment_status}`,
            },
          ],
          buttonText: "View your orders",
          buttonUrl: `${frontend}/orders`,
          footerMessage: settings.footerText,
        }),
      });
      await pool.query(
        "UPDATE order_email_outbox SET status='SENT',sent_at=NOW(),last_error=NULL WHERE order_group_id=$1",
        [job.order_group_id]
      );
    } catch (error) {
      await pool.query(
        "UPDATE order_email_outbox SET status='PENDING',last_error=$2,available_at=NOW()+($3 * interval '1 second') WHERE order_group_id=$1",
        [
          job.order_group_id,
          String(error.message).slice(0, 500),
          Math.min(3600, 30 * 2 ** Math.min(job.attempts, 7)),
        ]
      );
      console.error(
        "Order confirmation email queued for retry:",
        job.order_group_id
      );
    }
  }
};
