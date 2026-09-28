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

export const updateDeliveryLocationService = async ({
  deliveryAgentId,
  latitude,
  longitude,
}) => {
  const agentResult = await pool.query(
    `
        SELECT
          id,

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

  const result = await pool.query(
    `
        UPDATE delivery_agents

        SET
          latitude = $1,
          longitude = $2,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $3

        RETURNING
          public_id AS "publicId",

          latitude,
          longitude,

          is_online
            AS "isOnline",

          is_available
            AS "isAvailable",

          updated_at
            AS "updatedAt"
      `,
    [latitude, longitude, deliveryAgentId],
  );

  return result.rows[0];
};

// find and assign offer delivery agents service
export const findAndOfferDeliveryAgentService = async ({ orderNumber }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ==========================================
    // 1. Order + restaurant location
    // ==========================================

    const orderResult = await client.query(
      `
        SELECT
          o.id,

          o.order_number
            AS "orderNumber",

          o.status,

          o.assigned_delivery_agent_id
            AS "assignedDeliveryAgentId",

          r.restaurant_name
            AS "restaurantName",

          r.latitude
            AS "restaurantLatitude",

          r.longitude
            AS "restaurantLongitude"

        FROM orders o

        INNER JOIN restaurants r
          ON r.id = o.restaurant_id

        WHERE o.order_number = $1

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

    // ==========================================
    // 2. Order ready hona chahiye
    // ==========================================

    if (order.status !== "READY_FOR_PICKUP") {
      const error = new Error("Order is not ready for delivery assignment");

      error.statusCode = 409;
      throw error;
    }

    if (order.assignedDeliveryAgentId) {
      const error = new Error("Delivery agent is already assigned");

      error.statusCode = 409;
      throw error;
    }

    // ==========================================
    // 3. Restaurant location required
    // ==========================================

    if (
      order.restaurantLatitude === null ||
      order.restaurantLongitude === null
    ) {
      const error = new Error(
        "Restaurant location is required for delivery assignment",
      );

      error.statusCode = 400;
      throw error;
    }

    // ==========================================
    // 4. Expired offers update
    // ==========================================

    await client.query(
      `
        UPDATE delivery_assignments

        SET
          status = 'EXPIRED',

          responded_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE
          status = 'OFFERED'

          AND expires_at IS NOT NULL

          AND expires_at <=
              CURRENT_TIMESTAMP
      `,
    );

    // ==========================================
    // 5. Is order par already active offer?
    // ==========================================

    const existingOfferResult = await client.query(
      `
          SELECT
            da.status,

            da.offered_at
              AS "offeredAt",

            da.expires_at
              AS "expiresAt",

            d.public_id
              AS "deliveryAgentPublicId",

            d.name
              AS "deliveryAgentName"

          FROM delivery_assignments da

          INNER JOIN delivery_agents d
            ON d.id =
               da.delivery_agent_id

          WHERE
            da.order_id = $1

            AND da.status =
                'OFFERED'

            AND da.expires_at >
                CURRENT_TIMESTAMP

          LIMIT 1
        `,
      [order.id],
    );

    if (existingOfferResult.rows.length > 0) {
      await client.query("COMMIT");

      return {
        offered: true,

        alreadyOffered: true,

        offer: existingOfferResult.rows[0],
      };
    }

    // ==========================================
    // 6. Nearest eligible agent find
    // ==========================================

    const agentResult = await client.query(
      `
          SELECT
            d.id,

            d.public_id
              AS "publicId",

            d.name,

            d.latitude,
            d.longitude,

            (
              6371 * ACOS(
                LEAST(
                  1,
                  GREATEST(
                    -1,

                    COS(
                      RADIANS(
                        $1::double precision
                      )
                    )
                    *
                    COS(
                      RADIANS(
                        d.latitude::double precision
                      )
                    )
                    *
                    COS(
                      RADIANS(
                        d.longitude::double precision
                      )
                      -
                      RADIANS(
                        $2::double precision
                      )
                    )
                    +
                    SIN(
                      RADIANS(
                        $1::double precision
                      )
                    )
                    *
                    SIN(
                      RADIANS(
                        d.latitude::double precision
                      )
                    )
                  )
                )
              )
            ) AS "distanceKm"

          FROM delivery_agents d

          WHERE
            d.approval_status =
              'APPROVED'

            AND d.is_online = TRUE

            AND d.is_available = TRUE

            AND d.is_blocked = FALSE

            AND d.latitude IS NOT NULL

            AND d.longitude IS NOT NULL


            -- Is order ko jis agent ne
            -- pehle reject/expire kiya hai,
            -- usko same order dobara nahi denge

            AND NOT EXISTS (
              SELECT 1

              FROM delivery_assignments da

              WHERE
                da.order_id = $3

                AND da.delivery_agent_id =
                    d.id
            )


            -- Agent ke paas doosra
            -- active offer nahi hona chahiye

            AND NOT EXISTS (
              SELECT 1

              FROM delivery_assignments active_da

              WHERE
                active_da.delivery_agent_id =
                    d.id

                AND active_da.status =
                    'OFFERED'

                AND active_da.expires_at >
                    CURRENT_TIMESTAMP
            )


          ORDER BY
            "distanceKm" ASC

          LIMIT 1

          FOR UPDATE OF d
          SKIP LOCKED
        `,
      [order.restaurantLatitude, order.restaurantLongitude, order.id],
    );

    // ==========================================
    // 7. Koi agent available nahi
    // ==========================================

    if (agentResult.rows.length === 0) {
      await client.query("COMMIT");

      return {
        offered: false,

        message: "No delivery agent is currently available",
      };
    }

    const agent = agentResult.rows[0];

    // ==========================================
    // 8. Delivery offer create
    // 120 seconds
    // ==========================================

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
            CURRENT_TIMESTAMP
            + INTERVAL '120 seconds'
          )

          RETURNING
            status,

            offered_at
              AS "offeredAt",

            expires_at
              AS "expiresAt"
        `,
      [order.id, agent.id],
    );

    await client.query("COMMIT");

    return {
      offered: true,

      alreadyOffered: false,

      deliveryAgent: {
        publicId: agent.publicId,

        name: agent.name,

        distanceKm: Number(Number(agent.distanceKm).toFixed(2)),
      },

      offer: offerResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// get delivery order offer service
export const getDeliveryOrderOfferService = async ({ deliveryAgentId }) => {
  // Expired offer ko expire kar do
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

  const result = await pool.query(
    `
      SELECT
        o.order_number
          AS "orderNumber",

        o.status AS "orderStatus",

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

      ORDER BY da.offered_at DESC

      LIMIT 1
    `,
    [deliveryAgentId],
  );

  if (result.rows.length === 0) {
    return null;
  }

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
