import "dotenv/config";
import nodemailer from "nodemailer";

const configured = (value) => Boolean(value && !/yourmail|your_|replace|placeholder|example/i.test(value));
const report = (service, status, detail) => {
  console.log(`${service}: ${status}${detail ? ` (${detail})` : ""}`);
  if (status !== "PASS") process.exitCode = 1;
};

await Promise.all([
  (async () => {
    if (!configured(process.env.SMTP_USER) || !configured(process.env.SMTP_PASS))
      return report("SMTP", "MISSING", "Set SMTP_USER and SMTP_PASS in Backend/.env");
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    try {
      await transport.verify();
      report("SMTP", "PASS", "Authentication successful; no email sent");
    } catch (error) {
      report("SMTP", "FAIL", `${error.code || "CONNECTION_ERROR"}${error.responseCode ? ` / ${error.responseCode}` : ""}`);
    } finally {
      transport.close();
    }
  })(),
  (async () => {
    if (!configured(process.env.RAZORPAY_KEY_ID) || !configured(process.env.RAZORPAY_KEY_SECRET))
      return report("Razorpay", "MISSING", "Set actual RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env");
    try {
      const response = await fetch("https://api.razorpay.com/v1/orders?count=1", {
        headers: { Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}` },
        signal: AbortSignal.timeout(15000),
      });
      report("Razorpay", response.ok ? "PASS" : "FAIL", `HTTP ${response.status}; ${process.env.RAZORPAY_KEY_ID.startsWith("rzp_live_") ? "live" : "test"} mode; no payment created`);
    } catch (error) {
      report("Razorpay", "FAIL", error.cause?.code || error.name);
    }
  })(),
]);
