import pool from "../config/database.js";

export const getUserProfileService = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        phone,
        avatar,
        email_verified AS "emailVerified",
        is_blocked AS "isBlocked",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};
