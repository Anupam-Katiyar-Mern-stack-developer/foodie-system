import crypto from "crypto";
import bcrypt from "bcryptjs";

import pool from "../config/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import { passwordResetTemplate } from "../templates/auth/passwordReset.template.js";

const ACCOUNT_TABLES = {
  USER: "users",
  RESTAURANT: "restaurants",
  DELIVERY_AGENT: "delivery_agents",
  ADMIN: "admins",
};

const getAccountTable = (accountType) => {
  const normalizedType = String(accountType || "")
    .trim()
    .toUpperCase();

  const tableName = ACCOUNT_TABLES[normalizedType];

  if (!tableName) {
    const error = new Error("Invalid account type");
    error.statusCode = 400;
    throw error;
  }

  return {
    accountType: normalizedType,
    tableName,
  };
};

const hashResetToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const forgotPasswordService = async ({ email, accountType }) => {
  if (!email?.trim()) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const { accountType: normalizedAccountType, tableName } =
    getAccountTable(accountType);

  const normalizedEmail = email.trim().toLowerCase();

  const accountResult = await pool.query(
    `
      SELECT
        id,
        email
      FROM ${tableName}
      WHERE LOWER(email) = $1
      LIMIT 1
    `,
    [normalizedEmail],
  );

  const genericResponse = {
    message:
      "If an account exists with this email, a password reset link has been sent.",
  };

  if (accountResult.rows.length === 0) {
    return genericResponse;
  }

  const account = accountResult.rows[0];

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE account_type = $1
          AND account_id = $2
          AND used_at IS NULL
      `,
      [normalizedAccountType, account.id],
    );

    await client.query(
      `
        INSERT INTO password_reset_tokens (
          account_type,
          account_id,
          token_hash,
          expires_at
        )
        VALUES (
          $1,
          $2,
          $3,
          CURRENT_TIMESTAMP + INTERVAL '30 minutes'
        )
      `,
      [normalizedAccountType, account.id, tokenHash],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")[0]
    .trim()
    .replace(/\/+$/, "");

  const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;

  const template = passwordResetTemplate({
    resetUrl,
  });

  try {
    await sendEmail({
      to: account.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  } catch (error) {
    await pool.query(
      `
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE token_hash = $1
          AND used_at IS NULL
      `,
      [tokenHash],
    );

    const emailError = new Error("Password reset email could not be sent");

    emailError.statusCode = 500;
    throw emailError;
  }

  return genericResponse;
};

export const resetPasswordService = async ({
  token,
  password,
  confirmPassword,
}) => {
  if (!token?.trim()) {
    const error = new Error("Reset token is required");
    error.statusCode = 400;
    throw error;
  }

  if (!password) {
    const error = new Error("New password is required");
    error.statusCode = 400;
    throw error;
  }

  if (password !== confirmPassword) {
    const error = new Error("Password and confirm password do not match");

    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters long");

    error.statusCode = 400;
    throw error;
  }

  if (password.length > 72) {
    const error = new Error("Password must not exceed 72 characters");

    error.statusCode = 400;
    throw error;
  }

  const tokenHash = hashResetToken(token.trim());

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tokenResult = await client.query(
      `
        SELECT
          id,
          account_type AS "accountType",
          account_id AS "accountId"
        FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
        FOR UPDATE
      `,
      [tokenHash],
    );

    if (tokenResult.rows.length === 0) {
      const error = new Error("Reset link is invalid or has expired");

      error.statusCode = 400;
      throw error;
    }

    const resetToken = tokenResult.rows[0];

    const { tableName } = getAccountTable(resetToken.accountType);

    const hashedPassword = await bcrypt.hash(password, 12);

    const updateResult = await client.query(
      `
        UPDATE ${tableName}
        SET password = $1
        WHERE id = $2
        RETURNING id
      `,
      [hashedPassword, resetToken.accountId],
    );

    if (updateResult.rows.length === 0) {
      const error = new Error("Account no longer exists");

      error.statusCode = 400;
      throw error;
    }

    await client.query(
      `
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE account_type = $1
          AND account_id = $2
          AND used_at IS NULL
      `,
      [resetToken.accountType, resetToken.accountId],
    );

    await client.query("COMMIT");

    return {
      message:
        "Password reset successfully. You can now login with your new password.",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
