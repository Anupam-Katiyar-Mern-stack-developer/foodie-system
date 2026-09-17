import "dotenv/config";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";

const createAdmin = async () => {
  try {
    const name = "Super Admin";
    const email = "admin@foodie.com";
    const password = "Admin@123";

    const emailCheck = await pool.query(
      `
        SELECT id
        FROM admins
        WHERE email = $1
        LIMIT 1
      `,
      [email],
    );

    if (emailCheck.rows.length > 0) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
        INSERT INTO admins (
          name,
          email,
          password
        )
        VALUES ($1, $2, $3)

        RETURNING
          id,
          name,
          email,
          role,
          created_at
      `,
      [name, email, hashedPassword],
    );

    console.log("Admin created successfully:", result.rows[0]);
  } catch (error) {
    console.error("Create admin error:", error.message);
  } finally {
    await pool.end();
  }
};

createAdmin();
