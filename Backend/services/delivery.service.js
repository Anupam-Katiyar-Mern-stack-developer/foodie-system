import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { generateDeliveryAgentPublicId } from "../utils/generateDeliveryAgentPublicId.js";
import { saveImage, deleteImage } from "../utils/storage/imageStorage.js";
import jwt from "jsonwebtoken";

// register delivery agent
export const registerDeliveryAgentService = async ({
  name,
  email,
  phone,
  password,

  vehicleType,
  vehicleNumber,

  address,

  latitude,
  longitude,

  imageFile,
  imageFolder,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const normalizedPhone = phone.trim();

  const normalizedVehicleNumber = vehicleNumber.trim().toUpperCase();

  // Email / phone already registered?
  const existingResult = await pool.query(
    `
        SELECT
          email,
          phone

        FROM delivery_agents

        WHERE
          LOWER(email) = LOWER($1)
          OR phone = $2

        LIMIT 1
      `,
    [normalizedEmail, normalizedPhone],
  );

  if (existingResult.rows.length > 0) {
    const existing = existingResult.rows[0];

    if (existing.email.toLowerCase() === normalizedEmail) {
      const error = new Error("Delivery agent email is already registered");

      error.statusCode = 409;
      throw error;
    }

    const error = new Error(
      "Delivery agent phone number is already registered",
    );

    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const publicId = generateDeliveryAgentPublicId();

  let image = null;

  // Image optional
  if (imageFile) {
    image = await saveImage({
      file: imageFile,
      folder: imageFolder,
    });
  }

  try {
    const result = await pool.query(
      `
          INSERT INTO delivery_agents (
            public_id,

            name,
            email,
            phone,
            password,

            image,

            vehicle_type,
            vehicle_number,

            address,

            latitude,
            longitude
          )

          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11
          )

          RETURNING
            public_id AS "publicId",

            name,
            email,
            phone,

            image,

            vehicle_type
              AS "vehicleType",

            vehicle_number
              AS "vehicleNumber",

            address,

            latitude,
            longitude,

            approval_status
              AS "approvalStatus",

            email_verified
              AS "emailVerified",

            is_online
              AS "isOnline",

            is_available
              AS "isAvailable",

            created_at
              AS "createdAt"
        `,
      [
        publicId,

        name.trim(),
        normalizedEmail,
        normalizedPhone,
        hashedPassword,

        image,

        vehicleType.trim(),
        normalizedVehicleNumber,

        address?.trim() || null,

        latitude !== undefined && latitude !== "" ? Number(latitude) : null,

        longitude !== undefined && longitude !== "" ? Number(longitude) : null,
      ],
    );

    return result.rows[0];
  } catch (error) {
    // DB insert fail hua to saved image clean
    if (image) {
      try {
        await deleteImage(image);
      } catch (deleteError) {
        console.error(
          "Delivery agent image cleanup failed:",
          deleteError.message,
        );
      }
    }

    throw error;
  }
};
// login delivery agent
export const loginDeliveryAgentService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  console.log("email in services =>",normalizedEmail ,password);

  // Agent find
  const result = await pool.query(
    `
      SELECT
        id,

        public_id AS "publicId",

        name,
        email,
        phone,
        password,

        image,

        vehicle_type AS "vehicleType",
        vehicle_number AS "vehicleNumber",

        approval_status AS "approvalStatus",
        rejection_reason AS "rejectionReason",

        email_verified AS "emailVerified",

        is_online AS "isOnline",
        is_available AS "isAvailable",
        is_blocked AS "isBlocked"

      FROM delivery_agents

      WHERE LOWER(email) = LOWER($1)

      LIMIT 1
    `,
    [normalizedEmail],
  );

  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;
    throw error;
  }

  const agent = result.rows[0];

  // Password verify
  const passwordMatched = await bcrypt.compare(password, agent.password);

  if (passwordMatched) {
    const error = new Error("Invalid email or password");

    error.statusCode = 401;
    throw error;
  }

  // Blocked?
  if (agent.isBlocked) {
    const error = new Error("Your delivery account has been blocked");

    error.statusCode = 403;
    throw error;
  }

  // Pending
  if (agent.approvalStatus === "PENDING") {
    const error = new Error("Your account is waiting for admin approval");

    error.statusCode = 403;
    throw error;
  }

  // Rejected
  if (agent.approvalStatus === "REJECTED") {
    const error = new Error(
      agent.rejectionReason
        ? `Your registration was rejected: ${agent.rejectionReason}`
        : "Your delivery agent registration was rejected",
    );

    error.statusCode = 403;
    throw error;
  }

  // Suspended
  if (agent.approvalStatus === "SUSPENDED") {
    const error = new Error("Your delivery account is currently suspended");

    error.statusCode = 403;
    throw error;
  }

  // Safety check
  if (agent.approvalStatus !== "APPROVED") {
    const error = new Error("Delivery agent account is not approved");

    error.statusCode = 403;
    throw error;
  }

  // JWT
  const deliveryToken = jwt.sign(
    {
      deliveryAgentId: agent.id,
      publicId: agent.publicId,
      role: "deliveryAgent",
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    },
  );

  // Password response me nahi bhejna
  delete agent.password;

  return {
    deliveryToken,

    deliveryAgent: {
      publicId: agent.publicId,

      name: agent.name,

      email: agent.email,

      phone: agent.phone,

      image: agent.image,

      vehicleType: agent.vehicleType,

      vehicleNumber: agent.vehicleNumber,

      approvalStatus: agent.approvalStatus,

      emailVerified: agent.emailVerified,

      isOnline: agent.isOnline,

      isAvailable: agent.isAvailable,
    },
  };
};

// get pending delivery agent
export const getPendingDeliveryAgentsService = async () => {
  const result = await pool.query(
    `
      SELECT
        public_id AS "publicId",
        name,
        email,
        phone,
        image,

        vehicle_type AS "vehicleType",
        vehicle_number AS "vehicleNumber",

        address,
        latitude,
        longitude,

        approval_status AS "approvalStatus",

        created_at AS "createdAt"

      FROM delivery_agents

      WHERE approval_status = 'PENDING'

      ORDER BY created_at ASC
    `,
  );

  return result.rows;
};

// approve delivery agent service
export const approveDeliveryAgentService = async ({ publicId }) => {
  const result = await pool.query(
    `
      UPDATE delivery_agents

      SET
        approval_status = 'APPROVED',
        updated_at = CURRENT_TIMESTAMP

      WHERE
        public_id = $1
        AND approval_status = 'PENDING'

      RETURNING
        public_id AS "publicId",
        name,
        email,
        phone,

        approval_status AS "approvalStatus",

        updated_at AS "updatedAt"
    `,
    [publicId],
  );

  if (result.rows.length === 0) {
    const existing = await pool.query(
      `
        SELECT approval_status AS "approvalStatus"

        FROM delivery_agents

        WHERE public_id = $1

        LIMIT 1
      `,
      [publicId],
    );

    if (existing.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const error = new Error(
      `Delivery agent cannot be approved from ${existing.rows[0].approvalStatus} status`,
    );

    error.statusCode = 409;
    throw error;
  }

  return result.rows[0];
};

// reject deleivery agent service
export const rejectDeliveryAgentService = async ({ publicId, reason }) => {
  const result = await pool.query(
    `
      UPDATE delivery_agents

      SET
        approval_status = 'REJECTED',
        rejection_reason = $1,
        is_online = FALSE,
        is_available = FALSE,
        updated_at = CURRENT_TIMESTAMP

      WHERE
        public_id = $2
        AND approval_status = 'PENDING'

      RETURNING
        public_id AS "publicId",
        name,
        email,

        approval_status AS "approvalStatus",
        rejection_reason AS "rejectionReason",

        updated_at AS "updatedAt"
    `,
    [reason, publicId],
  );

  if (result.rows.length === 0) {
    const existing = await pool.query(
      `
        SELECT approval_status AS "approvalStatus"

        FROM delivery_agents

        WHERE public_id = $1

        LIMIT 1
      `,
      [publicId],
    );

    if (existing.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const error = new Error(
      `Delivery agent cannot be rejected from ${existing.rows[0].approvalStatus} status`,
    );

    error.statusCode = 409;
    throw error;
  }

  return result.rows[0];
};
