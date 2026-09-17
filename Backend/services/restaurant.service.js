import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import {
  restaurantRegisteredTemplate,
} from "../templates/restaurant/restaurantRegistered.template.js";

export const registerRestaurantService = async ({
  ownerName,
  restaurantName,
  email,
  phone,
  password,
  description,
  addressLine,
  city,
  state,
  pincode,
  latitude,
  longitude,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  const emailCheck = await pool.query(
    `
        SELECT id
        FROM restaurants WHERE email =$1
            LIMIT 1
        `,
    [normalizedEmail],
  );

  if (emailCheck.rows.length > 0) {
    const error = new Error("Restaurant email already register");
    error.statusCode = 409;
    throw error;
  }

  const phoneCheck = await pool.query(
    `
        SELECT id 
        FROM restaurants 
        WHERE phone = $1
        LIMIT 1
        `,
    [normalizedPhone],
  );

  if (phoneCheck.rows.length > 0) {
    const error = new Error("Restaurant phone number already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO restaurants(
        owner_name,
        restaurant_name,
        email,
        phone,
        password,
        description,
        address_line,
        city,
        state,
        pincode,
        latitude,
        longitude

        )
        VALUES(
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12
        )

        RETURNING
        id,
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
        is_open AS "isOpen",
        approval_status AS "approvalStatus",
        email_verified AS "emailVerified",
        is_blocked AS "isBlocked",
        created_at AS "createdAt"
        `,
    [
      ownerName.trim(),
      restaurantName.trim(),
      normalizedEmail,
      normalizedPhone,
      hashedPassword,
      description?.trim() || null,
      addressLine.trim(),
      city.trim(),
      state.trim(),
      pincode.trim(),
      latitude ?? null,
      longitude ?? null,
    ],
  );

  const restaurant = result.rows[0];

  const template = restaurantRegisteredTemplate({
    ownerName:restaurant.ownerName,
    restaurantName:restaurant.restaurantName,
    email:restaurant.email,
  });

  try{
    await sendEmail({
        to:restaurant.email, 
        ...template
    });
      console.log(
    "Restaurant registration email sent:",
    restaurant.email
  );
  } catch (error) {
  console.error(
    "Restaurant registration email failed:",
    error.message
  );
}

return restaurant;
};

//login services

export const loginRestaurantService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await pool.query(
    `
        SELECT 
          id,
          owner_name,
          restaurant_name,
          email,
          phone,
          password,
          description,
          logo,
          banner,
          address_line,
          city,
          state,
          pincode,
          latitude,
          longitude,
          opening_time,
          closing_time,
          is_open,
          approval_status,
          email_verified,
          is_blocked,
          created_at,
          updated_at
          FROM restaurants
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

  const restaurant = result.rows[0];

  //password check

  const isPasswordCorrect = await bcrypt.compare(password, restaurant.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  // Block check

  if (restaurant.is_blocked) {
    const error = new Error("Restaurant account is blocked");
    error.statusCode = 403;
    throw error;
  }

  if (restaurant.approval_status === "PENDING") {
    const error = new Error("Restaurant is waiting for admin approval");
    error.statusCode = 403;
    throw error;
  }

  if (restaurant.approval_status === "REJECTED") {
    const error = new Error("Restaurant registration  has been rejected");

    error.statusCode = 403;
    throw error;
  }

  if (restaurant.approval_status === "SUSPENDED") {
    const error = new Error("Restaurant account has been suspended");
    error.statusCode = 403;
    throw error;
  }

  if (restaurant.approval_status !== "APPROVED") {
    const error = new Error("Restaurant is not allowed login");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      restaurantId: restaurant.id,
      role: "restaurant",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  delete restaurant.password;

  return {
    restaurant,
    token,
  };
};

// get restaurant profile

export const getRestaurantProfileService = async ({ restaurantId }) => {
  const result = await pool.query(
    `
        SELECT
         id,
         owner_name AS "ownerName",
         restaurant_name AS "restaurantName",
         email,
         phone,
         description,
         logo,
         banner,
         address_line, AS "addressLine",
         city,
         state,
         pincode,
         latitude,
         longitude,
         opening_time AS "openingTime",
         closing_time AS "closingTime",
         is_open AS "isOpen",
         approval_status AS "approvalStatus",
         email_veriefied AS "emailVerified",
         is_blocked AS "isblocked",
         created_at AS "createdAt",
         updated_at AS "updatedAt",
         FROM restaurants 
          WHERE id =$1
          LIMIT 1

        `,
    [restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Restaurant not found");
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};
