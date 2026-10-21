import crypto from "node:crypto";
import pool from "../config/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import { emailLayout } from "../templates/common/emailLayout.js";
import { getSiteSettingsService } from "./setting.service.js";

const tables = {
  user: "users",
  restaurant: "restaurants",
  delivery: "delivery_agents",
  admin: "admins",
};
const fail = (message, statusCode = 400) =>
  Object.assign(new Error(message), { statusCode });
const tableFor = (kind) => {
  if (!tables[kind]) throw fail("Invalid account type");
  return tables[kind];
};
const digest = (kind, id, email, code) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw fail("Email verification is not configured", 503);
  return crypto
    .createHmac("sha256", secret)
    .update(`${kind}:${id}:${email.toLowerCase()}:${code}`)
    .digest("hex");
};
const accountFor = async (db, kind, id, lock = false) => {
  const row = (
    await db.query(
      `SELECT id,email,email_verified AS "emailVerified",is_blocked FROM ${tableFor(
        kind
      )} WHERE id=$1 ${lock ? "FOR UPDATE" : ""}`,
      [id]
    )
  ).rows[0];
  if (!row || row.is_blocked) throw fail("Account is unavailable", 403);
  return row;
};
export const getEmailVerificationStatus = async (kind, id) => {
  const account = await accountFor(pool, kind, id);
  const challenge = account.emailVerified
    ? null
    : (
        await pool.query(
          "SELECT email,expires_at,sent_at,attempts FROM email_verifications WHERE account_kind=$1 AND account_id=$2",
          [kind, id]
        )
      ).rows[0];
  const codePending = Boolean(
    challenge &&
      challenge.email.toLowerCase() === account.email.toLowerCase() &&
      new Date(challenge.expires_at).getTime() > Date.now() &&
      challenge.attempts < 5
  );
  return {
    email: account.email,
    emailVerified: account.emailVerified,
    codePending,
    retryAfter: challenge
      ? Math.max(
          0,
          Math.ceil(
            (new Date(challenge.sent_at).getTime() + 60000 - Date.now()) / 1000
          )
        )
      : 0,
  };
};
export const sendEmailVerification = async (kind, id) => {
  tableFor(kind);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const account = await accountFor(client, kind, id, true);
    if (account.emailVerified) {
      await client.query("COMMIT");
      return { email: account.email, emailVerified: true };
    }
    const current = (
      await client.query(
        "SELECT * FROM email_verifications WHERE account_kind=$1 AND account_id=$2 FOR UPDATE",
        [kind, id]
      )
    ).rows[0];
    const now = Date.now();
    if (current && now - new Date(current.sent_at).getTime() < 60000) {
      const error = fail("Please wait before requesting another code", 429);
      error.retryAfter = Math.ceil(
        (60000 - (now - new Date(current.sent_at).getTime())) / 1000
      );
      throw error;
    }
    const sameWindow =
      current && now - new Date(current.window_started_at).getTime() < 3600000;
    if (sameWindow && current.send_count >= 5)
      throw fail(
        "Too many verification emails. Please try again in an hour.",
        429
      );
    const code = String(crypto.randomInt(100000, 1000000));
    await client.query(
      `INSERT INTO email_verifications(account_kind,account_id,email,code_hash,expires_at,sent_at,attempts,send_count,window_started_at) VALUES($1,$2,$3,$4,NOW()+INTERVAL '10 minutes',NOW(),0,$5,$6)
      ON CONFLICT(account_kind,account_id) DO UPDATE SET email=EXCLUDED.email,code_hash=EXCLUDED.code_hash,expires_at=EXCLUDED.expires_at,sent_at=EXCLUDED.sent_at,attempts=0,send_count=EXCLUDED.send_count,window_started_at=EXCLUDED.window_started_at`,
      [
        kind,
        id,
        account.email,
        digest(kind, id, account.email, code),
        sameWindow ? current.send_count + 1 : 1,
        sameWindow ? current.window_started_at : new Date(now),
      ]
    );
    const settings = await getSiteSettingsService();
    try {
      await sendEmail({
        to: account.email,
        fromName: settings.siteName,
        subject: `${settings.siteName}: verify your email`,
        text: `Your email verification code is ${code}. It expires in 10 minutes. Do not share this code.`,
        html: emailLayout({
          brandName: settings.siteName,
          title: "One last step. Verify your email.",
          greeting: "Hello there,",
          message:
            "Use the code below to verify your email address. Enter it in the verification window where you requested it.",
          verificationCode: code,
          details: [
            { label: "Valid for", value: "10 minutes" },
            { label: "Purpose", value: "Email verification" },
          ],
          footerMessage:
            "Never share this code. If you did not request it, you can safely ignore this email.",
        }),
      });
    } catch {
      throw fail(
        "Unable to send verification email. Please try again shortly.",
        503
      );
    }
    await client.query("COMMIT");
    return {
      email: account.email,
      emailVerified: false,
      retryAfter: 60,
      expiresIn: 600,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const verifyEmailCode = async (kind, id, code) => {
  if (typeof code !== "string" || !/^\d{6}$/.test(code))
    throw fail("Enter the 6-digit verification code");
  const client = await pool.connect();
  let committed = false;
  try {
    await client.query("BEGIN");
    const account = await accountFor(client, kind, id, true);
    if (account.emailVerified) {
      await client.query("COMMIT");
      committed = true;
      return { email: account.email, emailVerified: true };
    }
    const challenge = (
      await client.query(
        "SELECT * FROM email_verifications WHERE account_kind=$1 AND account_id=$2 FOR UPDATE",
        [kind, id]
      )
    ).rows[0];
    if (
      !challenge ||
      challenge.email.toLowerCase() !== account.email.toLowerCase()
    )
      throw fail("Request a verification code for your current email first");
    if (new Date(challenge.expires_at).getTime() <= Date.now())
      throw fail("This code has expired. Request a new code.", 410);
    if (challenge.attempts >= 5)
      throw fail("Too many incorrect attempts. Request a new code.", 429);
    const expected = Buffer.from(digest(kind, id, account.email, code), "hex"),
      actual = Buffer.from(challenge.code_hash, "hex");
    if (
      expected.length !== actual.length ||
      !crypto.timingSafeEqual(expected, actual)
    ) {
      await client.query(
        "UPDATE email_verifications SET attempts=attempts+1 WHERE account_kind=$1 AND account_id=$2",
        [kind, id]
      );
      await client.query("COMMIT");
      committed = true;
      throw fail("Incorrect code. Please check the latest email.");
    }
    await client.query(
      `UPDATE ${tableFor(
        kind
      )} SET email_verified=TRUE,updated_at=NOW() WHERE id=$1`,
      [id]
    );
    await client.query(
      "DELETE FROM email_verifications WHERE account_kind=$1 AND account_id=$2",
      [kind, id]
    );
    await client.query("COMMIT");
    committed = true;
    return { email: account.email, emailVerified: true };
  } catch (error) {
    if (!committed) await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
