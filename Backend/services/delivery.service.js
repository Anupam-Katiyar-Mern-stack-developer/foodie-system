import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { generateDeliveryAgentPublicId } from "../utils/generateDeliveryAgentPublicId.js";
import { saveImage, deleteImage } from "../utils/storage/imageStorage.js";
import jwt from "jsonwebtoken";
import {
  generateDeliveryOtp,
  hashDeliveryOtp,
  verifyDeliveryOtp,
} from "../utils/deliveryOtp.js";

import { sendEmail } from "../utils/sendEmail.js";

import { deliveryOtpTemplate } from "../templates/order/deliveryOtp.template.js";

// register delivery agent
export const registerDeliveryAgentService = async ({
  name,
  email,
  phone,
  password,
  vehicleType,
  vehicleNumber,
  address,
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
      address
    )

    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9
    )

    RETURNING
      public_id AS "publicId",
      name,
      email,
      phone,
      image,
      vehicle_type AS "vehicleType",
      vehicle_number AS "vehicleNumber",
      address,
      approval_status AS "approvalStatus",
      email_verified AS "emailVerified",
      is_online AS "isOnline",
      is_available AS "isAvailable",
      created_at AS "createdAt"
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
  console.log("email in services =>", normalizedEmail, password);

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

  if (!passwordMatched) {
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

// get delivery profile service
export const getDeliveryProfileService = async ({ deliveryAgentId }) => {
  const result = await pool.query(
    `
        SELECT
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

          is_blocked
            AS "isBlocked",

          created_at
            AS "createdAt",

          updated_at
            AS "updatedAt"

        FROM delivery_agents

        WHERE id = $1

        LIMIT 1
      `,
    [deliveryAgentId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Delivery agent not found");

    error.statusCode = 404;
    throw error;
  }

  const agent = result.rows[0];

  if (agent.isBlocked) {
    const error = new Error("Your delivery account has been blocked");

    error.statusCode = 403;
    throw error;
  }

  if (agent.approvalStatus !== "APPROVED") {
    const error = new Error("Your delivery account is not approved");

    error.statusCode = 403;
    throw error;
  }

  // isBlocked frontend ko expose karne ki
  // zarurat nahi
  delete agent.isBlocked;

  return agent;
};

// update delievry AGENT
export const updateDeliveryProfileService = async ({
  deliveryAgentId,

  name,
  email,
  phone,

  vehicleType,
  vehicleNumber,

  address,

  imageFile,
  imageFolder,
}) => {
  // Current agent
  const existingResult = await pool.query(
    `
        SELECT
          id,

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

          approval_status
            AS "approvalStatus",

          is_blocked
            AS "isBlocked"

        FROM delivery_agents

        WHERE id = $1

        LIMIT 1
      `,
    [deliveryAgentId],
  );

  if (existingResult.rows.length === 0) {
    const error = new Error("Delivery agent not found");

    error.statusCode = 404;
    throw error;
  }

  const existingAgent = existingResult.rows[0];

  if (existingAgent.isBlocked) {
    const error = new Error("Your delivery account has been blocked");

    error.statusCode = 403;
    throw error;
  }

  if (existingAgent.approvalStatus !== "APPROVED") {
    const error = new Error("Your delivery account is not approved");

    error.statusCode = 403;
    throw error;
  }

  // =========================
  // Final values
  // =========================

  const finalName = name !== undefined ? name.trim() : existingAgent.name;

  if (!finalName) {
    const error = new Error("Name is required");

    error.statusCode = 400;
    throw error;
  }

  const finalEmail =
    email !== undefined ? email.trim().toLowerCase() : existingAgent.email;

  if (!finalEmail) {
    const error = new Error("Email is required");

    error.statusCode = 400;
    throw error;
  }

  const finalPhone = phone !== undefined ? phone.trim() : existingAgent.phone;

  if (!finalPhone) {
    const error = new Error("Phone number is required");

    error.statusCode = 400;
    throw error;
  }

  const finalVehicleType =
    vehicleType !== undefined ? vehicleType.trim() : existingAgent.vehicleType;

  const finalVehicleNumber =
    vehicleNumber !== undefined
      ? vehicleNumber.trim().toUpperCase()
      : existingAgent.vehicleNumber;

  const finalAddress =
    address !== undefined ? address.trim() || null : existingAgent.address;

  // =========================
  // Email/Phone duplicate check
  // =========================

  const duplicateResult = await pool.query(
    `
        SELECT
          id,
          email,
          phone

        FROM delivery_agents

        WHERE
          id <> $1

          AND (
            LOWER(email) = LOWER($2)
            OR phone = $3
          )

        LIMIT 1
      `,
    [deliveryAgentId, finalEmail, finalPhone],
  );

  if (duplicateResult.rows.length > 0) {
    const duplicate = duplicateResult.rows[0];

    if (duplicate.email.toLowerCase() === finalEmail.toLowerCase()) {
      const error = new Error(
        "Email is already registered with another delivery agent",
      );

      error.statusCode = 409;
      throw error;
    }

    const error = new Error(
      "Phone number is already registered with another delivery agent",
    );

    error.statusCode = 409;
    throw error;
  }

  // =========================
  // New image
  // =========================

  let newImage = null;

  if (imageFile) {
    newImage = await saveImage({
      file: imageFile,
      folder: imageFolder,
    });
  }

  try {
    const result = await pool.query(
      `
          UPDATE delivery_agents

          SET
            name = $1,
            email = $2,
            phone = $3,

            vehicle_type = $4,
            vehicle_number = $5,

            address = $6,

            image = $7,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE id = $8

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

            updated_at
              AS "updatedAt"
        `,
      [
        finalName,
        finalEmail,
        finalPhone,

        finalVehicleType,
        finalVehicleNumber,

        finalAddress,

        newImage || existingAgent.image,

        deliveryAgentId,
      ],
    );

    const updatedAgent = result.rows[0];

    // DB successfully update hone ke baad
    // purani image remove
    if (newImage && existingAgent.image) {
      try {
        await deleteImage(existingAgent.image);
      } catch (error) {
        console.error("Old delivery image delete failed:", error.message);
      }
    }

    return updatedAgent;
  } catch (error) {
    // DB fail hua to nayi image clean
    if (newImage) {
      try {
        await deleteImage(newImage);
      } catch (deleteError) {
        console.error(
          "New delivery image cleanup failed:",
          deleteError.message,
        );
      }
    }

    throw error;
  }
};

// update delivery status service
export const updateDeliveryStatusService = async ({
  deliveryAgentId,
  isOnline,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Current agent lock
    const agentResult = await client.query(
      `
          SELECT
            id,

            public_id AS "publicId",

            approval_status
              AS "approvalStatus",

            is_blocked
              AS "isBlocked",

            is_online
              AS "isOnline",

            is_available
              AS "isAvailable"

          FROM delivery_agents

          WHERE id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [deliveryAgentId],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    if (agent.isBlocked) {
      const error = new Error("Your delivery account has been blocked");

      error.statusCode = 403;
      throw error;
    }

    if (agent.approvalStatus !== "APPROVED") {
      const error = new Error(
        "Only approved delivery agents can change online status",
      );

      error.statusCode = 403;
      throw error;
    }

    // Active delivery check
    const activeOrderResult = await client.query(
      `
          SELECT
            order_number AS "orderNumber",
            status

          FROM orders

          WHERE
            assigned_delivery_agent_id = $1

            AND status IN (
              'DELIVERY_ASSIGNED',
              'PICKED_UP',
              'OUT_FOR_DELIVERY'
            )

          LIMIT 1
        `,
      [deliveryAgentId],
    );

    const hasActiveOrder = activeOrderResult.rows.length > 0;

    /*
      Agent OFFLINE hona chahta hai
      lekin delivery chal rahi hai.
    */
    if (isOnline === false && hasActiveOrder) {
      const activeOrder = activeOrderResult.rows[0];

      const error = new Error(
        `You cannot go offline while order ${activeOrder.orderNumber} is ${activeOrder.status}`,
      );

      error.statusCode = 409;
      throw error;
    }

    /*
      Online + no active order
      => available

      Online + active order
      => unavailable

      Offline
      => unavailable
    */
    const isAvailable = isOnline && !hasActiveOrder;

    const updateResult = await client.query(
      `
          UPDATE delivery_agents

          SET
            is_online = $1,
            is_available = $2,
            updated_at =
              CURRENT_TIMESTAMP

          WHERE id = $3

          RETURNING
            public_id AS "publicId",

            is_online AS "isOnline",

            is_available
              AS "isAvailable",

            updated_at
              AS "updatedAt"
        `,
      [isOnline, isAvailable, deliveryAgentId],
    );

    await client.query("COMMIT");

    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// update location service
// update delivery agent live location
export const updateDeliveryLocationService = async ({
  deliveryAgentId,
  latitude,
  longitude,
}) => {
  const agentResult = await pool.query(
    `
      SELECT
        id,
        approval_status AS "approvalStatus",
        is_blocked AS "isBlocked"
      FROM delivery_agents
      WHERE id = $1
      LIMIT 1
    `,
    [deliveryAgentId],
  );

  if (agentResult.rows.length === 0) {
    const error = new Error("Delivery agent not found");
    error.statusCode = 404;
    throw error;
  }

  const agent = agentResult.rows[0];

  if (agent.isBlocked) {
    const error = new Error("Your delivery account has been blocked");
    error.statusCode = 403;
    throw error;
  }

  if (agent.approvalStatus !== "APPROVED") {
    const error = new Error(
      "Only approved delivery agents can update location",
    );
    error.statusCode = 403;
    throw error;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    const error = new Error("Valid latitude and longitude are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `
      UPDATE delivery_agents
      SET
        latitude = $1,
        longitude = $2,
        location_updated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        public_id AS "publicId",
        latitude,
        longitude,
        is_online AS "isOnline",
        is_available AS "isAvailable",
        location_updated_at AS "locationUpdatedAt",
        updated_at AS "updatedAt"
    `,
    [lat, lng, deliveryAgentId],
  );

  return result.rows[0];
};
// find and assign offer delivery agents service

// get delivery order offer service
export const getDeliveryOrderOfferService = async ({ deliveryAgentId }) => {
  // =========================================
  // 1. OLD EXPIRED OFFERS EXPIRE KARO
  // =========================================

  await pool.query(
    `
      UPDATE delivery_assignments

      SET
        status = 'EXPIRED',
        responded_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP

      WHERE
        delivery_agent_id = $1
        AND status = 'OFFERED'
        AND expires_at <= CURRENT_TIMESTAMP
    `,
    [deliveryAgentId],
  );

  // =========================================
  // 2. ACTIVE OFFER FETCH KARO
  // =========================================

  const result = await pool.query(
    `
      SELECT
        o.order_number
          AS "orderNumber",

        o.status
          AS "orderStatus",

        o.total_amount
          AS "totalAmount",

        da.status
          AS "offerStatus",

        da.offered_at
          AS "offeredAt",

        da.expires_at
          AS "expiresAt",

        r.restaurant_name
          AS "restaurantName",

        r.slug
          AS "restaurantSlug",

        r.address_line
          AS "restaurantAddress",

        r.city
          AS "restaurantCity",

        r.latitude
          AS "restaurantLatitude",

        r.longitude
          AS "restaurantLongitude",

        og.city
          AS "deliveryCity",

        og.pincode
          AS "deliveryPincode",

        (
          SELECT COUNT(*)::int
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS "totalItems"

      FROM delivery_assignments da

      INNER JOIN orders o
        ON o.id = da.order_id

      INNER JOIN restaurants r
        ON r.id = o.restaurant_id

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE
        da.delivery_agent_id = $1

        AND da.status = 'OFFERED'

        AND da.expires_at >
            CURRENT_TIMESTAMP

        AND o.status =
            'READY_FOR_PICKUP'

      ORDER BY
        da.offered_at DESC

      LIMIT 1
    `,
    [deliveryAgentId],
  );

  console.log(result);

  // =========================================
  // 3. NO OFFER
  // =========================================

  if (result.rows.length === 0) {
    return null;
  }

  // =========================================
  // 4. RETURN ACTIVE OFFER
  // =========================================

  return result.rows[0];
};

// accept delivery order service
export const acceptDeliveryOrderService = async ({
  deliveryAgentId,
  orderNumber,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =================================
    // Agent lock + validation
    // =================================

    const agentResult = await client.query(
      `
          SELECT
            id,

            public_id
              AS "publicId",

            name,

            approval_status
              AS "approvalStatus",

            is_online
              AS "isOnline",

            is_available
              AS "isAvailable",

            is_blocked
              AS "isBlocked"

          FROM delivery_agents

          WHERE id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [deliveryAgentId],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    if (agent.approvalStatus !== "APPROVED" || agent.isBlocked) {
      const error = new Error("Delivery agent account is not available");

      error.statusCode = 403;
      throw error;
    }

    if (!agent.isOnline) {
      const error = new Error("You must be online to accept an order");

      error.statusCode = 409;
      throw error;
    }

    if (!agent.isAvailable) {
      const error = new Error(
        "You are currently unavailable for a new delivery",
      );

      error.statusCode = 409;
      throw error;
    }

    // =================================
    // Active offer find + lock
    // =================================

    const offerResult = await client.query(
      `
          SELECT
            da.id
              AS "assignmentId",

            da.expires_at
              AS "expiresAt",

            o.id
              AS "orderId",

            o.status,

            o.assigned_delivery_agent_id
              AS "assignedDeliveryAgentId"

          FROM delivery_assignments da

          INNER JOIN orders o
            ON o.id = da.order_id

          WHERE
            o.order_number = $1

            AND da.delivery_agent_id = $2

            AND da.status = 'OFFERED'

            AND da.expires_at >
                CURRENT_TIMESTAMP

          LIMIT 1

          FOR UPDATE OF da, o
        `,
      [orderNumber, deliveryAgentId],
    );

    if (offerResult.rows.length === 0) {
      const error = new Error("Delivery offer not found or has expired");

      error.statusCode = 409;
      throw error;
    }

    const offer = offerResult.rows[0];

    if (offer.status !== "READY_FOR_PICKUP") {
      const error = new Error(
        `Order cannot be accepted from ${offer.status} status`,
      );

      error.statusCode = 409;
      throw error;
    }

    if (offer.assignedDeliveryAgentId) {
      const error = new Error(
        "Another delivery agent is already assigned to this order",
      );

      error.statusCode = 409;
      throw error;
    }

    // =================================
    // Assignment ACCEPTED
    // =================================

    await client.query(
      `
        UPDATE delivery_assignments

        SET
          status = 'ACCEPTED',

          responded_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [offer.assignmentId],
    );

    // =================================
    // Order agent assign
    // =================================

    const orderResult = await client.query(
      `
          UPDATE orders

          SET
            status =
              'DELIVERY_ASSIGNED',

            assigned_delivery_agent_id =
              $1,

            delivery_assigned_at =
              CURRENT_TIMESTAMP,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            id = $2
            AND status =
                'READY_FOR_PICKUP'

            AND assigned_delivery_agent_id
                IS NULL

          RETURNING
            order_number
              AS "orderNumber",

            status,

            delivery_assigned_at
              AS "deliveryAssignedAt"
        `,
      [deliveryAgentId, offer.orderId],
    );

    if (orderResult.rows.length === 0) {
      const error = new Error("Order could not be assigned");

      error.statusCode = 409;
      throw error;
    }

    // =================================
    // Agent busy
    // =================================

    await client.query(
      `
        UPDATE delivery_agents

        SET
          is_available = FALSE,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [deliveryAgentId],
    );

    await client.query("COMMIT");

    return {
      ...orderResult.rows[0],

      deliveryAgent: {
        publicId: agent.publicId,

        name: agent.name,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// reject delivery order service
export const rejectDeliveryOrderService = async ({
  deliveryAgentId,
  orderNumber,
}) => {
  const client = await pool.connect();

  let rejectedOrder = null;

  try {
    await client.query("BEGIN");

    const offerResult = await client.query(
      `
          SELECT
            da.id
              AS "assignmentId",

            o.id
              AS "orderId",

            o.order_number
              AS "orderNumber",

            o.status

          FROM delivery_assignments da

          INNER JOIN orders o
            ON o.id = da.order_id

          WHERE
            o.order_number = $1

            AND da.delivery_agent_id = $2

            AND da.status = 'OFFERED'

            AND da.expires_at >
                CURRENT_TIMESTAMP

          LIMIT 1

          FOR UPDATE OF da, o
        `,
      [orderNumber, deliveryAgentId],
    );

    if (offerResult.rows.length === 0) {
      const error = new Error("Delivery offer not found or has expired");

      error.statusCode = 409;
      throw error;
    }

    const offer = offerResult.rows[0];

    if (offer.status !== "READY_FOR_PICKUP") {
      const error = new Error("This order is no longer available for delivery");

      error.statusCode = 409;
      throw error;
    }

    await client.query(
      `
        UPDATE delivery_assignments

        SET
          status = 'REJECTED',

          responded_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [offer.assignmentId],
    );

    rejectedOrder = {
      orderNumber: offer.orderNumber,

      status: "REJECTED",
    };

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }

  /*
    Transaction complete hone ke baad
    next agent find karo.
  */

  let nextOffer = null;

  try {
    nextOffer = await findAndOfferDeliveryAgentService({
      orderNumber,
    });
  } catch (error) {
    console.error("Next delivery agent offer failed:", error.message);
  }

  return {
    ...rejectedOrder,

    nextOffer,
  };
};

// get active delivery order service
export const getActiveDeliveryOrderService = async ({ deliveryAgentId }) => {
  const orderResult = await pool.query(
    `
      SELECT
        o.id,

        o.order_number
          AS "orderNumber",

        o.status,

        o.subtotal,

        o.delivery_fee
          AS "deliveryFee",

        o.tax_amount
          AS "taxAmount",

        o.total_amount
          AS "totalAmount",

        o.delivery_assigned_at
          AS "deliveryAssignedAt",

        o.picked_up_at
          AS "pickedUpAt",

        o.created_at
          AS "createdAt",


        r.restaurant_name
          AS "restaurantName",

        r.slug
          AS "restaurantSlug",

        r.logo
          AS "restaurantLogo",

        r.phone
          AS "restaurantPhone",

        r.address_line
          AS "restaurantAddress",

        r.city
          AS "restaurantCity",

        r.state
          AS "restaurantState",

        r.pincode
          AS "restaurantPincode",

        r.latitude
          AS "restaurantLatitude",

        r.longitude
          AS "restaurantLongitude",


        og.delivery_name
          AS "customerName",

        og.delivery_phone
          AS "customerPhone",

        og.address_line
          AS "deliveryAddress",

        og.landmark,

        og.city
          AS "deliveryCity",

        og.state
          AS "deliveryState",

        og.pincode
          AS "deliveryPincode",

        og.latitude
          AS "deliveryLatitude",

        og.longitude
          AS "deliveryLongitude",

        og.payment_method
          AS "paymentMethod",

        og.payment_status
          AS "paymentStatus"

      FROM orders o

      INNER JOIN restaurants r
        ON r.id = o.restaurant_id

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE
        o.assigned_delivery_agent_id = $1

        AND o.status IN (
          'DELIVERY_ASSIGNED',
          'PICKED_UP',
          'OUT_FOR_DELIVERY'
        )

      ORDER BY o.created_at DESC

      LIMIT 1
    `,
    [deliveryAgentId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `
      SELECT
        food_name
          AS "name",

        food_slug
          AS "slug",

        food_image
          AS "image",

        unit_price
          AS "unitPrice",

        quantity,

        item_total
          AS "itemTotal"

      FROM order_items

      WHERE order_id = $1

      ORDER BY id ASC
    `,
    [order.id],
  );

  delete order.id;

  return {
    ...order,

    items: itemsResult.rows,
  };
};

// pickup delivery order service

export const pickupDeliveryOrderService = async ({
  deliveryAgentId,
  orderNumber,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Agent lock
    const agentResult = await client.query(
      `
          SELECT
            id,

            approval_status
              AS "approvalStatus",

            is_online
              AS "isOnline",

            is_available
              AS "isAvailable",

            is_blocked
              AS "isBlocked"

          FROM delivery_agents

          WHERE id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [deliveryAgentId],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    if (agent.approvalStatus !== "APPROVED" || agent.isBlocked) {
      const error = new Error("Delivery agent account is not available");

      error.statusCode = 403;
      throw error;
    }

    if (!agent.isOnline) {
      const error = new Error("You must be online to pickup an order");

      error.statusCode = 409;
      throw error;
    }

    // Order lock
    const orderResult = await client.query(
      `
          SELECT
            id,
            status,

            assigned_delivery_agent_id
              AS "assignedDeliveryAgentId"

          FROM orders

          WHERE
            order_number = $1

          LIMIT 1

          FOR UPDATE
        `,
      [orderNumber],
    );

    if (orderResult.rows.length === 0) {
      const error = new Error("Order not found");

      error.statusCode = 404;
      throw error;
    }

    const order = orderResult.rows[0];

    // Ownership check
    if (Number(order.assignedDeliveryAgentId) !== Number(deliveryAgentId)) {
      const error = new Error("This order is not assigned to you");

      error.statusCode = 403;
      throw error;
    }

    // Correct status required
    if (order.status !== "DELIVERY_ASSIGNED") {
      const error = new Error(
        `Order cannot be picked up from ${order.status} status`,
      );

      error.statusCode = 409;
      throw error;
    }

    const updateResult = await client.query(
      `
          UPDATE orders

          SET
            status = 'PICKED_UP',

            picked_up_at =
              CURRENT_TIMESTAMP,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            id = $1
            AND assigned_delivery_agent_id = $2
            AND status = 'DELIVERY_ASSIGNED'

          RETURNING
            order_number
              AS "orderNumber",

            status,

            picked_up_at
              AS "pickedUpAt",

            updated_at
              AS "updatedAt"
        `,
      [order.id, deliveryAgentId],
    );

    if (updateResult.rows.length === 0) {
      const error = new Error("Order could not be picked up");

      error.statusCode = 409;
      throw error;
    }

    /*
      Agent still busy.

      is_online = true
      is_available = false
    */
    await client.query(
      `
        UPDATE delivery_agents

        SET
          is_available = FALSE,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [deliveryAgentId],
    );

    await client.query("COMMIT");

    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// marked order out for delivery service
export const markOrderOutForDeliveryService = async ({
  deliveryAgentId,
  orderNumber,
}) => {
  const client = await pool.connect();

  let emailData = null;
  let generatedOtp = null;

  try {
    await client.query("BEGIN");

    // ==================================
    // 1. Agent validation
    // ==================================

    const agentResult = await client.query(
      `
          SELECT
            id,

            approval_status
              AS "approvalStatus",

            is_online
              AS "isOnline",

            is_blocked
              AS "isBlocked"

          FROM delivery_agents

          WHERE id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [deliveryAgentId],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    if (agent.approvalStatus !== "APPROVED" || agent.isBlocked) {
      const error = new Error("Delivery agent account is not available");

      error.statusCode = 403;
      throw error;
    }

    if (!agent.isOnline) {
      const error = new Error("You must be online to start delivery");

      error.statusCode = 409;
      throw error;
    }

    // ==================================
    // 2. Order + Customer
    // ==================================

    const orderResult = await client.query(
      `
          SELECT
            o.id,

            o.status,

            o.assigned_delivery_agent_id
              AS "assignedDeliveryAgentId",

            og.delivery_name
              AS "customerName",

            u.email
              AS "customerEmail"

          FROM orders o

          INNER JOIN order_groups og
            ON og.id =
               o.order_group_id

          INNER JOIN users u
            ON u.id =
               og.user_id

          WHERE
            o.order_number = $1

          LIMIT 1

          FOR UPDATE OF o
        `,
      [orderNumber],
    );

    if (orderResult.rows.length === 0) {
      const error = new Error("Order not found");

      error.statusCode = 404;
      throw error;
    }

    const order = orderResult.rows[0];

    // ==================================
    // 3. Ownership
    // ==================================

    if (Number(order.assignedDeliveryAgentId) !== Number(deliveryAgentId)) {
      const error = new Error("This order is not assigned to you");

      error.statusCode = 403;
      throw error;
    }

    // ==================================
    // 4. Correct status
    // ==================================

    if (order.status !== "PICKED_UP") {
      const error = new Error(
        `Order cannot move to out for delivery from ${order.status} status`,
      );

      error.statusCode = 409;
      throw error;
    }

    // ==================================
    // 5. Generate OTP
    // ==================================

    generatedOtp = generateDeliveryOtp();

    const otpHash = hashDeliveryOtp(generatedOtp);

    // ==================================
    // 6. Update order
    // ==================================

    const updateResult = await client.query(
      `
          UPDATE orders

          SET
            status =
              'OUT_FOR_DELIVERY',

            out_for_delivery_at =
              CURRENT_TIMESTAMP,

            delivery_otp_hash =
              $1,

            delivery_otp_expires_at =
              CURRENT_TIMESTAMP
              + INTERVAL '15 minutes',

            delivery_otp_attempts = 0,

            delivery_otp_verified_at =
              NULL,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            id = $2

            AND assigned_delivery_agent_id =
                $3

            AND status =
                'PICKED_UP'

          RETURNING
            order_number
              AS "orderNumber",

            status,

            out_for_delivery_at
              AS "outForDeliveryAt",

            delivery_otp_expires_at
              AS "otpExpiresAt"
        `,
      [otpHash, order.id, deliveryAgentId],
    );

    if (updateResult.rows.length === 0) {
      const error = new Error("Order could not be moved to out for delivery");

      error.statusCode = 409;
      throw error;
    }

    emailData = {
      customerName: order.customerName,

      customerEmail: order.customerEmail,

      orderNumber,
    };

    await client.query("COMMIT");

    // ==================================
    // 7. Send OTP after DB commit
    // ==================================

    let otpSent = false;

    try {
      const template = deliveryOtpTemplate({
        customerName: emailData.customerName,

        orderNumber: emailData.orderNumber,

        otp: generatedOtp,
      });

      await sendEmail({
        to: emailData.customerEmail,

        subject: template.subject,

        html: template.html,

        text: template.text,
      });

      otpSent = true;
    } catch (emailError) {
      console.error("Delivery OTP email failed:", emailError.message);
    }

    return {
      ...updateResult.rows[0],

      otpSent,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// complete delivery agent
export const completeDeliveryOrderService = async ({
  deliveryAgentId,
  orderNumber,
  otp,
}) => {
  const client = await pool.connect();

  let transactionOpen = false;

  try {
    await client.query("BEGIN");

    transactionOpen = true;

    // ==========================================
    // 1. Delivery Agent lock + validation
    // ==========================================

    const agentResult = await client.query(
      `
          SELECT
            id,

            public_id
              AS "publicId",

            name,

            approval_status
              AS "approvalStatus",

            is_online
              AS "isOnline",

            is_blocked
              AS "isBlocked"

          FROM delivery_agents

          WHERE id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [deliveryAgentId],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery agent not found");

      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    if (agent.approvalStatus !== "APPROVED" || agent.isBlocked) {
      const error = new Error("Delivery agent account is not available");

      error.statusCode = 403;
      throw error;
    }

    // ==========================================
    // 2. Order find + lock
    // ==========================================

    const orderResult = await client.query(
      `
          SELECT
            id,

            status,

            assigned_delivery_agent_id
              AS "assignedDeliveryAgentId",

            delivery_otp_hash
              AS "deliveryOtpHash",

            delivery_otp_expires_at
              AS "deliveryOtpExpiresAt",

            delivery_otp_attempts
              AS "deliveryOtpAttempts"

          FROM orders

          WHERE order_number = $1

          LIMIT 1

          FOR UPDATE
        `,
      [orderNumber],
    );

    if (orderResult.rows.length === 0) {
      const error = new Error("Order not found");

      error.statusCode = 404;
      throw error;
    }

    const order = orderResult.rows[0];

    // ==========================================
    // 3. Ownership check
    // ==========================================

    if (Number(order.assignedDeliveryAgentId) !== Number(deliveryAgentId)) {
      const error = new Error("This order is not assigned to you");

      error.statusCode = 403;
      throw error;
    }

    // ==========================================
    // 4. Status check
    // ==========================================

    if (order.status !== "OUT_FOR_DELIVERY") {
      const error = new Error(
        `Order cannot be delivered from ${order.status} status`,
      );

      error.statusCode = 409;
      throw error;
    }

    // ==========================================
    // 5. OTP exists?
    // ==========================================

    if (!order.deliveryOtpHash || !order.deliveryOtpExpiresAt) {
      const error = new Error("Delivery OTP is not available");

      error.statusCode = 409;
      throw error;
    }

    // ==========================================
    // 6. Maximum attempts
    // ==========================================

    if (order.deliveryOtpAttempts >= 5) {
      const error = new Error(
        "Maximum OTP attempts exceeded. Generate a new OTP.",
      );

      error.statusCode = 429;
      throw error;
    }

    // ==========================================
    // 7. OTP expired?
    // ==========================================

    const otpExpired =
      new Date(order.deliveryOtpExpiresAt).getTime() <= Date.now();

    if (otpExpired) {
      const error = new Error("Delivery OTP has expired");

      error.statusCode = 410;
      throw error;
    }

    // ==========================================
    // 8. Verify OTP
    // ==========================================

    const otpValid = verifyDeliveryOtp({
      otp,
      otpHash: order.deliveryOtpHash,
    });

    // ==========================================
    // WRONG OTP
    // ==========================================

    if (!otpValid) {
      const attemptsResult = await client.query(
        `
            UPDATE orders

            SET
              delivery_otp_attempts =
                delivery_otp_attempts + 1,

              updated_at =
                CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING
              delivery_otp_attempts
                AS "deliveryOtpAttempts"
          `,
        [order.id],
      );

      const attempts = attemptsResult.rows[0].deliveryOtpAttempts;

      await client.query("COMMIT");

      transactionOpen = false;

      const remainingAttempts = Math.max(0, 5 - attempts);

      const error = new Error(
        remainingAttempts > 0
          ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
          : "Maximum OTP attempts exceeded. Generate a new OTP.",
      );

      error.statusCode = remainingAttempts > 0 ? 400 : 429;

      throw error;
    }

    // ==========================================
    // 9. Correct OTP → DELIVERED
    // ==========================================

    const deliveredResult = await client.query(
      `
          UPDATE orders

          SET
            status = 'DELIVERED',

            delivery_otp_verified_at =
              CURRENT_TIMESTAMP,

            delivered_at =
              CURRENT_TIMESTAMP,

            delivery_otp_hash =
              NULL,

            delivery_otp_expires_at =
              NULL,

            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            id = $1

            AND assigned_delivery_agent_id =
                $2

            AND status =
                'OUT_FOR_DELIVERY'

          RETURNING
            order_number
              AS "orderNumber",

            status,

            delivered_at
              AS "deliveredAt",

            delivery_otp_verified_at
              AS "otpVerifiedAt",

            total_amount
              AS "totalAmount"
        `,
      [order.id, deliveryAgentId],
    );

    if (deliveredResult.rows.length === 0) {
      const error = new Error("Order could not be completed");

      error.statusCode = 409;
      throw error;
    }

    // ==========================================
    // 10. Agent free again
    // ==========================================

    await client.query(
      `
        UPDATE delivery_agents

        SET
          is_available =
            CASE
              WHEN is_online = TRUE
              THEN TRUE
              ELSE FALSE
            END,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [deliveryAgentId],
    );

    await client.query("COMMIT");

    transactionOpen = false;

    return {
      ...deliveredResult.rows[0],

      deliveryAgent: {
        publicId: agent.publicId,

        name: agent.name,

        isAvailable: agent.isOnline ? true : false,
      },
    };
  } catch (error) {
    if (transactionOpen) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    client.release();
  }
};

// =========================================
// DELIVERY DASHBOARD
// =========================================

export const getDeliveryDashboardService = async ({ deliveryAgentId }) => {
  const [
    agentResult,
    statsResult,
    currentDeliveryResult,
    recentDeliveriesResult,
  ] = await Promise.all([
    // =========================
    // AGENT STATUS
    // =========================
    pool.query(
      `
        SELECT
          is_online AS "isOnline"

        FROM delivery_agents

        WHERE id = $1

        LIMIT 1
      `,
      [deliveryAgentId],
    ),

    // =========================
    // DASHBOARD STATS
    // =========================
    pool.query(
      `
        SELECT
          COUNT(DISTINCT o.id) FILTER (
            WHERE o.created_at::date = CURRENT_DATE
          )::int AS "todayDeliveries",

          COUNT(DISTINCT o.id) FILTER (
            WHERE o.status IN (
              'DELIVERY_ASSIGNED',
              'PICKED_UP',
              'OUT_FOR_DELIVERY'
            )
          )::int AS "activeDelivery",

          COUNT(DISTINCT o.id) FILTER (
            WHERE
              o.status = 'DELIVERED'
              AND o.delivered_at::date = CURRENT_DATE
          )::int AS "completedToday",

          COALESCE(
            SUM(o.delivery_fee) FILTER (
              WHERE
                o.status = 'DELIVERED'
                AND o.delivered_at::date = CURRENT_DATE
            ),
            0
          ) AS "todayEarnings"

        FROM delivery_assignments da

        INNER JOIN orders o
          ON o.id = da.order_id

        WHERE da.delivery_agent_id = $1
      `,
      [deliveryAgentId],
    ),

    // =========================
    // CURRENT DELIVERY
    // =========================
    pool.query(
      `
        SELECT
          o.order_number AS "orderNumber",

          o.status,

          r.restaurant_name AS "restaurantName",

          og.delivery_name AS "customerName",

          CONCAT_WS(
            ', ',
            NULLIF(og.address_line, ''),
            NULLIF(og.city, ''),
            NULLIF(og.state, ''),
            NULLIF(og.pincode, '')
          ) AS "customerAddress",

          (
            SELECT COUNT(*)::int

            FROM order_items oi

            WHERE oi.order_id = o.id
          ) AS "totalItems"

        FROM delivery_assignments da

        INNER JOIN orders o
          ON o.id = da.order_id

        INNER JOIN order_groups og
          ON og.id = o.order_group_id

        INNER JOIN restaurants r
          ON r.id = o.restaurant_id

        WHERE
          da.delivery_agent_id = $1

          AND o.status IN (
            'DELIVERY_ASSIGNED',
            'PICKED_UP',
            'OUT_FOR_DELIVERY'
          )

        ORDER BY o.updated_at DESC

        LIMIT 1
      `,
      [deliveryAgentId],
    ),

    // =========================
    // RECENT DELIVERIES
    // =========================
    pool.query(
      `
        SELECT
          o.order_number AS "orderNumber",

          r.restaurant_name AS "restaurantName",

          og.delivery_name AS "customerName",

          o.total_amount AS "amount",

          o.status

        FROM delivery_assignments da

        INNER JOIN orders o
          ON o.id = da.order_id

        INNER JOIN order_groups og
          ON og.id = o.order_group_id

        INNER JOIN restaurants r
          ON r.id = o.restaurant_id

        WHERE
          da.delivery_agent_id = $1

          AND o.status = 'DELIVERED'

        ORDER BY o.delivered_at DESC NULLS LAST

        LIMIT 5
      `,
      [deliveryAgentId],
    ),
  ]);

  if (agentResult.rows.length === 0) {
    const error = new Error("Delivery agent not found");
    error.statusCode = 404;
    throw error;
  }

  const stats = statsResult.rows[0] || {};

  const currentDelivery = currentDeliveryResult.rows[0]
    ? {
        ...currentDeliveryResult.rows[0],

        // Restaurant address columns ka exact schema
        // available nahi tha, abhi empty.
        restaurantAddress: "",
      }
    : null;

  return {
    isOnline: Boolean(agentResult.rows[0].isOnline),

    stats: {
      todayDeliveries: Number(stats.todayDeliveries || 0),
      activeDelivery: Number(stats.activeDelivery || 0),
      completedToday: Number(stats.completedToday || 0),
      todayEarnings: Number(stats.todayEarnings || 0),
    },

    currentDelivery,

    recentDeliveries: recentDeliveriesResult.rows.map((item) => ({
      ...item,
      amount: Number(item.amount || 0),
    })),
  };
};

// get delivery history
export const getDeliveryHistoryService = async ({
  deliveryAgentId,
  status,
  search,
  page = 1,
  limit = 20,
}) => {
  const offset = (page - 1) * limit;
  const allowedStatuses = ["DELIVERED", "CANCELLED"];

  if (status && !allowedStatuses.includes(status)) {
    const error = new Error("Invalid delivery history status");
    error.statusCode = 400;
    throw error;
  }

  const values = [deliveryAgentId];
  const conditions = [
    "da.delivery_agent_id = $1",
    "o.status IN ('DELIVERED', 'CANCELLED')",
  ];

  if (status) {
    values.push(status);
    conditions.push(`o.status = $${values.length}`);
  }

  if (search) {
    values.push(`%${search.trim()}%`);
    const position = values.length;

    conditions.push(`
      (
        o.order_number ILIKE $${position}
        OR r.restaurant_name ILIKE $${position}
        OR og.delivery_name ILIKE $${position}
      )
    `);
  }

  const whereClause = conditions.join(" AND ");

  const statsResult = await pool.query(
    `
      SELECT
        COUNT(DISTINCT o.id)::int AS "totalDeliveries",

        COUNT(DISTINCT o.id) FILTER (
          WHERE o.status = 'DELIVERED'
        )::int AS "completed",

        COUNT(DISTINCT o.id) FILTER (
          WHERE o.status = 'CANCELLED'
        )::int AS "cancelled",

        COALESCE(
          SUM(o.delivery_fee) FILTER (
            WHERE o.status = 'DELIVERED'
          ),
          0
        ) AS "totalEarnings"

      FROM delivery_assignments da

      INNER JOIN orders o
        ON o.id = da.order_id

      WHERE
        da.delivery_agent_id = $1
        AND o.status IN ('DELIVERED', 'CANCELLED')
    `,
    [deliveryAgentId],
  );

  const countResult = await pool.query(
    `
      SELECT COUNT(DISTINCT o.id)::int AS total

      FROM delivery_assignments da

      INNER JOIN orders o
        ON o.id = da.order_id

      INNER JOIN restaurants r
        ON r.id = o.restaurant_id

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE ${whereClause}
    `,
    values,
  );

  const queryValues = [...values, limit, offset];
  const limitPosition = queryValues.length - 1;
  const offsetPosition = queryValues.length;

  const historyResult = await pool.query(
    `
      SELECT
        o.order_number AS "orderNumber",
        r.restaurant_name AS "restaurantName",
        og.delivery_name AS "customerName",
        o.total_amount AS "amount",
        o.delivery_fee AS "earning",
        o.status,

        CASE
          WHEN o.status = 'DELIVERED' THEN o.delivered_at
          WHEN o.status = 'CANCELLED' THEN o.cancelled_at
          ELSE o.updated_at
        END AS "completedAt"

      FROM delivery_assignments da

      INNER JOIN orders o
        ON o.id = da.order_id

      INNER JOIN restaurants r
        ON r.id = o.restaurant_id

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE ${whereClause}

      ORDER BY
        COALESCE(
          o.delivered_at,
          o.cancelled_at,
          o.updated_at
        ) DESC

      LIMIT $${limitPosition}
      OFFSET $${offsetPosition}
    `,
    queryValues,
  );

  const stats = statsResult.rows[0];
  const total = countResult.rows[0]?.total || 0;

  return {
    stats: {
      totalDeliveries: Number(stats?.totalDeliveries || 0),
      completed: Number(stats?.completed || 0),
      cancelled: Number(stats?.cancelled || 0),
      totalEarnings: Number(stats?.totalEarnings || 0),
    },

    deliveries: historyResult.rows.map((item) => ({
      ...item,
      amount: Number(item.amount || 0),
      earning: Number(item.earning || 0),
      distance: null,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ==========================================
// GET AVAILABLE DELIVERY AGENTS FOR ORDER
// ==========================================

export const getAvailableDeliveryAgentsForOrderService = async ({
  restaurantId,
  orderNumber,
}) => {
  // Expire old offers
  await pool.query(`
    UPDATE delivery_assignments
    SET
      status = 'EXPIRED',
      responded_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE
      status = 'OFFERED'
      AND expires_at IS NOT NULL
      AND expires_at <= CURRENT_TIMESTAMP
  `);

  // Get order
  const orderResult = await pool.query(
    `
      SELECT
        o.id,
        o.order_number AS "orderNumber",
        o.status,
        o.assigned_delivery_agent_id AS "assignedDeliveryAgentId",
        r.latitude AS "restaurantLatitude",
        r.longitude AS "restaurantLongitude"
      FROM orders o
      INNER JOIN restaurants r
        ON r.id = o.restaurant_id
      WHERE
        o.order_number = $1
        AND o.restaurant_id = $2
      LIMIT 1
    `,
    [orderNumber, restaurantId],
  );

  if (orderResult.rows.length === 0) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const order = orderResult.rows[0];

  if (order.status !== "READY_FOR_PICKUP") {
    const error = new Error(
      "Order must be ready for pickup before assigning a delivery partner",
    );
    error.statusCode = 409;
    throw error;
  }

  if (order.assignedDeliveryAgentId) {
    const error = new Error(
      "Delivery partner is already assigned to this order",
    );
    error.statusCode = 409;
    throw error;
  }

  const restaurantLatitude = Number(order.restaurantLatitude);
  const restaurantLongitude = Number(order.restaurantLongitude);

  if (
    !Number.isFinite(restaurantLatitude) ||
    !Number.isFinite(restaurantLongitude)
  ) {
    const error = new Error("Restaurant location is not available");
    error.statusCode = 400;
    throw error;
  }

  // Current active offer on this order
  const activeOfferResult = await pool.query(
    `
      SELECT id
      FROM delivery_assignments
      WHERE
        order_id = $1
        AND status = 'OFFERED'
        AND expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `,
    [order.id],
  );

  if (activeOfferResult.rows.length > 0) {
    const error = new Error(
      "A delivery offer is already pending for this order",
    );
    error.statusCode = 409;
    throw error;
  }

  // Find available agents
  const agentsResult = await pool.query(
    `
      WITH nearby_agents AS (
        SELECT
          d.id,
          d.public_id AS "publicId",
          d.name,
          d.image,
          d.vehicle_type AS "vehicleType",
          d.vehicle_number AS "vehicleNumber",
          d.location_updated_at AS "locationUpdatedAt",

          (
            6371 * ACOS(
              LEAST(
                1,
                GREATEST(
                  -1,
                  COS(RADIANS($1::double precision))
                  * COS(RADIANS(d.latitude::double precision))
                  * COS(
                    RADIANS(d.longitude::double precision)
                    - RADIANS($2::double precision)
                  )
                  + SIN(RADIANS($1::double precision))
                  * SIN(RADIANS(d.latitude::double precision))
                )
              )
            )
          ) AS "distanceKm"

        FROM delivery_agents d

        WHERE
          d.approval_status = 'APPROVED'
          AND d.is_online = TRUE
          AND d.is_available = TRUE
          AND d.is_blocked = FALSE
          AND d.latitude IS NOT NULL
          AND d.longitude IS NOT NULL

          AND (
            d.location_updated_at IS NULL
            OR d.location_updated_at >=
              CURRENT_TIMESTAMP - INTERVAL '30 minutes'
          )

          -- Active delivery nahi honi chahiye
          AND NOT EXISTS (
            SELECT 1
            FROM orders active_order
            WHERE
              active_order.assigned_delivery_agent_id = d.id
              AND active_order.status IN (
                'DELIVERY_ASSIGNED',
                'PICKED_UP',
                'OUT_FOR_DELIVERY'
              )
          )

          -- Agent ke paas koi active offer nahi hona chahiye
          AND NOT EXISTS (
            SELECT 1
            FROM delivery_assignments active_offer
            WHERE
              active_offer.delivery_agent_id = d.id
              AND active_offer.status = 'OFFERED'
              AND active_offer.expires_at > CURRENT_TIMESTAMP
          )
      )

      SELECT
        "publicId",
        name,
        image,
        "vehicleType",
        "vehicleNumber",
        ROUND("distanceKm"::numeric, 2)::double precision AS "distanceKm",
        "locationUpdatedAt"

      FROM nearby_agents

      WHERE "distanceKm" <= 10

      ORDER BY "distanceKm" ASC

      LIMIT 30
    `,
    [restaurantLatitude, restaurantLongitude],
  );

  return {
    orderNumber: order.orderNumber,
    total: agentsResult.rows.length,
    agents: agentsResult.rows,
  };
};
// ==========================================
// RESTAURANT SEND DELIVERY OFFER
// ==========================================

export const createRestaurantDeliveryOfferService = async ({
  restaurantId,
  orderNumber,
  deliveryAgentPublicId,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Expire old offers
    await client.query(`
      UPDATE delivery_assignments
      SET
        status = 'EXPIRED',
        responded_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        status = 'OFFERED'
        AND expires_at IS NOT NULL
        AND expires_at <= CURRENT_TIMESTAMP
    `);

    // Order
    const orderResult = await client.query(
      `
        SELECT
          o.id,
          o.order_number AS "orderNumber",
          o.status,
          o.assigned_delivery_agent_id AS "assignedDeliveryAgentId",
          r.latitude AS "restaurantLatitude",
          r.longitude AS "restaurantLongitude"
        FROM orders o
        INNER JOIN restaurants r ON r.id = o.restaurant_id
        WHERE o.order_number = $1 AND o.restaurant_id = $2
        LIMIT 1
        FOR UPDATE OF o
      `,
      [orderNumber, restaurantId],
    );

    if (orderResult.rows.length === 0) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    const order = orderResult.rows[0];

    if (order.status !== "READY_FOR_PICKUP") {
      const error = new Error(
        "Order must be ready for pickup before sending delivery offer",
      );
      error.statusCode = 409;
      throw error;
    }

    if (order.assignedDeliveryAgentId) {
      const error = new Error(
        "Delivery partner is already assigned to this order",
      );
      error.statusCode = 409;
      throw error;
    }

    const restaurantLatitude = Number(order.restaurantLatitude);
    const restaurantLongitude = Number(order.restaurantLongitude);

    if (
      !Number.isFinite(restaurantLatitude) ||
      !Number.isFinite(restaurantLongitude)
    ) {
      const error = new Error("Restaurant location is not available");
      error.statusCode = 400;
      throw error;
    }

    // Order par koi active offer already hai?
    const existingOrderOffer = await client.query(
      `
        SELECT id
        FROM delivery_assignments
        WHERE
          order_id = $1
          AND status = 'OFFERED'
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [order.id],
    );

    if (existingOrderOffer.rows.length > 0) {
      const error = new Error(
        "This order already has a pending delivery offer",
      );
      error.statusCode = 409;
      throw error;
    }

    // Selected agent
    const agentResult = await client.query(
      `
        SELECT
          d.id,
          d.public_id AS "publicId",
          d.name,
          d.image,
          d.vehicle_type AS "vehicleType",
          d.vehicle_number AS "vehicleNumber",
          d.latitude,
          d.longitude,
          d.location_updated_at AS "locationUpdatedAt",
          d.approval_status AS "approvalStatus",
          d.is_online AS "isOnline",
          d.is_available AS "isAvailable",
          d.is_blocked AS "isBlocked",

          (
            6371 * ACOS(
              LEAST(
                1,
                GREATEST(
                  -1,
                  COS(RADIANS($2::double precision))
                  * COS(RADIANS(d.latitude::double precision))
                  * COS(
                    RADIANS(d.longitude::double precision)
                    - RADIANS($3::double precision)
                  )
                  + SIN(RADIANS($2::double precision))
                  * SIN(RADIANS(d.latitude::double precision))
                )
              )
            )
          ) AS "distanceKm"

        FROM delivery_agents d
        WHERE d.public_id = $1
        LIMIT 1
        FOR UPDATE OF d
      `,
      [deliveryAgentPublicId, restaurantLatitude, restaurantLongitude],
    );

    if (agentResult.rows.length === 0) {
      const error = new Error("Delivery partner not found");
      error.statusCode = 404;
      throw error;
    }

    const agent = agentResult.rows[0];

    // Agent account
    if (agent.approvalStatus !== "APPROVED" || agent.isBlocked) {
      const error = new Error("Delivery partner account is not available");
      error.statusCode = 409;
      throw error;
    }

    // Online / available
    if (!agent.isOnline || !agent.isAvailable) {
      const error = new Error("Delivery partner is currently unavailable");
      error.statusCode = 409;
      throw error;
    }

    // Location
    if (agent.latitude === null || agent.longitude === null) {
      const error = new Error("Delivery partner location is unavailable");
      error.statusCode = 409;
      throw error;
    }

    // Fresh location check only when timestamp exists
    if (agent.locationUpdatedAt) {
      const locationAge =
        Date.now() - new Date(agent.locationUpdatedAt).getTime();

      if (!Number.isFinite(locationAge) || locationAge > 30 * 60 * 1000) {
        const error = new Error("Delivery partner location is outdated");
        error.statusCode = 409;
        throw error;
      }
    }

    // Distance
    const distanceKm = Number(agent.distanceKm);

    if (!Number.isFinite(distanceKm) || distanceKm > 10) {
      const error = new Error(
        "Delivery partner is outside the delivery assignment range",
      );
      error.statusCode = 409;
      throw error;
    }

    // Active delivery?
    const activeDeliveryResult = await client.query(
      `
        SELECT id
        FROM orders
        WHERE
          assigned_delivery_agent_id = $1
          AND status IN (
            'DELIVERY_ASSIGNED',
            'PICKED_UP',
            'OUT_FOR_DELIVERY'
          )
        LIMIT 1
      `,
      [agent.id],
    );

    if (activeDeliveryResult.rows.length > 0) {
      const error = new Error(
        "Delivery partner is currently handling another delivery",
      );
      error.statusCode = 409;
      throw error;
    }

    // Agent ke paas active pending offer?
    const agentOfferResult = await client.query(
      `
        SELECT id
        FROM delivery_assignments
        WHERE
          delivery_agent_id = $1
          AND status = 'OFFERED'
          AND expires_at > CURRENT_TIMESTAMP
        LIMIT 1
      `,
      [agent.id],
    );

    if (agentOfferResult.rows.length > 0) {
      const error = new Error(
        "Delivery partner already has another pending offer",
      );
      error.statusCode = 409;
      throw error;
    }

    // Same order + agent ka OLD assignment record
    const previousOfferResult = await client.query(
      `
        SELECT id, status
        FROM delivery_assignments
        WHERE
          order_id = $1
          AND delivery_agent_id = $2
        ORDER BY id DESC
        LIMIT 1
        FOR UPDATE
      `,
      [order.id, agent.id],
    );

    let offer;

    if (previousOfferResult.rows.length > 0) {
      const previousOffer = previousOfferResult.rows[0];

      // Old rejected/expired offer ko reuse karo
      if (
        previousOffer.status === "REJECTED" ||
        previousOffer.status === "EXPIRED"
      ) {
        const offerResult = await client.query(
          `
            UPDATE delivery_assignments
            SET
              status = 'OFFERED',
              offered_at = CURRENT_TIMESTAMP,
              expires_at =
                CURRENT_TIMESTAMP + INTERVAL '120 seconds',
              responded_at = NULL,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING
              status,
              offered_at AS "offeredAt",
              expires_at AS "expiresAt"
          `,
          [previousOffer.id],
        );

        offer = offerResult.rows[0];
      } else {
        const error = new Error(
          "This delivery offer cannot be sent again right now",
        );
        error.statusCode = 409;
        throw error;
      }
    } else {
      // First time offer
      const offerResult = await client.query(
        `
          INSERT INTO delivery_assignments (
            order_id,
            delivery_agent_id,
            status,
            expires_at
          )
          VALUES (
            $1,
            $2,
            'OFFERED',
            CURRENT_TIMESTAMP + INTERVAL '120 seconds'
          )
          RETURNING
            status,
            offered_at AS "offeredAt",
            expires_at AS "expiresAt"
        `,
        [order.id, agent.id],
      );

      offer = offerResult.rows[0];
    }

    await client.query("COMMIT");

    return {
      orderNumber: order.orderNumber,

      deliveryAgent: {
        publicId: agent.publicId,
        name: agent.name,
        image: agent.image,
        vehicleType: agent.vehicleType,
        vehicleNumber: agent.vehicleNumber,
        distanceKm: Number(distanceKm.toFixed(2)),
      },

      offer,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      const conflictError = new Error(
        "This order or delivery partner already has an active offer",
      );
      conflictError.statusCode = 409;
      throw conflictError;
    }

    throw error;
  } finally {
    client.release();
  }
};
