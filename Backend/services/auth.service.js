import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";

export const registerUserService = async ({ name, email, phone, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone?.trim() || null;

  const emailCheck = await pool.query(
    `SELECT id, email FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  if (emailCheck.rows.length > 0) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  if (normalizedPhone) {
    const phoneCheck = await pool.query(
      `SELECT id phone FROM users WHERE phone = $1`,
      [normalizedPhone],
    );

    if (phoneCheck.rows.length > 0) {
      const error = new Error("Phone number already registered");
      error.statusCode = 409;
      throw error;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (
       name,
       email,
       phone,
       password
       )
       VALUES ($1,$2,$3,$4)
       
       RETURNING 
       id,
       name,
       email,
       phone,
       avatar,
       email_verified,
       is_blocked,
       created_at,
       updated_at
       `,
    [name.trim(), normalizedEmail, normalizedPhone, hashedPassword],
  );
  return result.rows[0];
};

export const loginUserService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    ` SELECT 
        id,
        name,
        email,
        phone,
        password,
        avatar,
        email_verified,
        is_blocked,
        updated_at
         FROM users
         WHERE email = $1
         LIMIT 1
        `,
    [normalizedEmail],
  );

  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];

  if (user.is_blocked) {
    const error = new Error("Your account has been  blocked");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email aur password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  delete user.password;

  return {
    user,
    token,
  };
};
