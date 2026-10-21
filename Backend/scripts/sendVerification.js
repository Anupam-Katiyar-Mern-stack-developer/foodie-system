import pool from "../config/database.js";
import { sendEmailVerification } from "../services/emailVerification.service.js";

try {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: node scripts/sendVerification.js user@email.com");
  const { rows } = await pool.query("SELECT id FROM users WHERE LOWER(email)=$1", [email]);
  if (!rows.length) throw new Error("No registered user with this email");
  const result = await sendEmailVerification("user", rows[0].id);
  console.log(result.emailVerified ? "Email already verified" : "Verification code sent; enter it in the app within 10 minutes");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
