import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import { restaurantApprovedTemplate } from "../templates/restaurant/restaurantApproved.template.js";
import { restaurantRejectedTemplate } from "../templates/restaurant/restaurantRejected.template.js";
// login Admin service

export const loginAdminService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        email,
        password,
        role,
        is_blocked
      FROM admins
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

  const admin = result.rows[0];

  if (admin.is_blocked) {
    const error = new Error("Admin account is blocked");

    error.statusCode = 403;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  delete admin.password;

  return {
    admin,
    token,
  };
};

//get pending restaurant service

export const getPendingRestaurantsService = async () => {
  const result = await pool.query(
    `
      SELECT
        slug,
        owner_name AS "ownerName",
        restaurant_name AS "restaurantName",
        email,
        phone,
        description,
        address_line AS "addressLine",
        city,
        state,
        pincode,
        latitude,
        longitude,
        approval_status AS "approvalStatus",
        created_at AS "createdAt"
      FROM restaurants
      WHERE approval_status = 'PENDING'
      ORDER BY created_at ASC
    `,
  );

  return result.rows;
};

//approve restaurant service
export const approveRestaurantService = async ({ adminId, restaurantSlug }) => {
  const result = await pool.query(
    `
        UPDATE restaurants

        SET 
            approval_status='APPROVED',
            reviewed_by=$1,
           reviewed_at = CURRENT_TIMESTAMP,
        rejection_reason = NULL,
        updated_at = CURRENT_TIMESTAMP

        WHERE slug = $2
        AND approval_status='PENDING'

        RETURNING
          slug,
           restaurant_name AS "restaurantName",
        email,
        approval_status AS "approvalStatus",
        reviewed_at AS "reviewedAt"
        `,
    [adminId, restaurantSlug],
  );

  if (result.rows.length === 0) {
    const error = new Error("Pending restaurant not found");
    error.statusCode = 404;
    throw error;
  }

  const restaurant = result.rows[0];

  if (!restaurant) {
    const error = new Error("Pending restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  const template = restaurantApprovedTemplate({
    ownerName: restaurant.ownerName,
    restaurantName: restaurant.restaurantName,
    email: restaurant.email,
  });
  try {
    await sendEmail({
      to: restaurant.email,
      ...template,
    });

    console.log("Restaurant approval email sent:", restaurant.email);
  } catch (error) {
    console.error("Restaurant approval email failed:", error.message);
  }

  return restaurant;
};

//reject restaurant service
export const rejectRestaurantService = async ({
  adminId,
  restaurantSlug,
  reason,
}) => {
  const result = await pool.query(
    `
      UPDATE restaurants

      SET
        approval_status = 'REJECTED',
        reviewed_by = $1,
        reviewed_at = CURRENT_TIMESTAMP,
        rejection_reason = $2,
        updated_at = CURRENT_TIMESTAMP

      WHERE slug = $3
      AND approval_status = 'PENDING'

      RETURNING
        slug,
        restaurant_name AS "restaurantName",
        email,
        approval_status AS "approvalStatus",
        rejection_reason AS "rejectionReason",
        reviewed_at AS "reviewedAt"
    `,
    [adminId, reason.trim(), restaurantSlug],
  );

  if (result.rows.length === 0) {
    const error = new Error("Pending restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  const restaurant = result.rows[0];

  if (!restaurant) {
    const error = new Error("Pending restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  const template = restaurantRejectedTemplate({
    ownerName: restaurant.ownerName,
    restaurantName: restaurant.restaurantName,
    email: restaurant.email,
    reason: restaurant.rejectionReason,
  });

  try {
    await sendEmail({
      to: restaurant.email,
      ...template,
    });

    console.log("Restaurant rejection email sent:", restaurant.email);
  } catch (error) {
    console.error("Restaurant rejection email failed:", error.message);
  }

  return restaurant;
};
