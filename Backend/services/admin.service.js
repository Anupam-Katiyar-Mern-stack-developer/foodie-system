import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { sendEmail } from "../utils/sendEmail.js";
import { restaurantApprovedTemplate } from "../templates/restaurant/restaurantApproved.template.js";
import { restaurantRejectedTemplate } from "../templates/restaurant/restaurantRejected.template.js";

export const getAdminProfileService = async (adminId) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role FROM admins WHERE id = $1 AND is_blocked = FALSE`,
    [adminId]
  );
  if (!rows[0])
    throw Object.assign(new Error("Admin account unavailable"), {
      statusCode: 401,
    });
  return rows[0];
};

export const updateAdminProfileService = async ({
  adminId,
  name,
  email,
  currentPassword,
  newPassword,
}) => {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    typeof email !== "string" ||
    email.trim().length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw Object.assign(new Error("Valid name and email are required"), {
      statusCode: 400,
    });
  }
  const { rows } = await pool.query(
    "SELECT * FROM admins WHERE id = $1 AND is_blocked = FALSE",
    [adminId]
  );
  const admin = rows[0];
  if (
    !admin ||
    typeof currentPassword !== "string" ||
    !currentPassword ||
    !(await bcrypt.compare(currentPassword, admin.password))
  ) {
    throw Object.assign(new Error("Current password is incorrect"), {
      statusCode: 400,
    });
  }
  if (
    newPassword &&
    (typeof newPassword !== "string" ||
      newPassword.length < 8 ||
      newPassword.length > 72)
  ) {
    throw Object.assign(new Error("New password must be 8–72 characters"), {
      statusCode: 400,
    });
  }
  const password = newPassword
    ? await bcrypt.hash(newPassword, 12)
    : admin.password;
  try {
    const result = await pool.query(
      `UPDATE admins SET name=$1, email=$2, password=$3, updated_at=CURRENT_TIMESTAMP
       WHERE id=$4 RETURNING id, name, email, role`,
      [name.trim(), email.trim().toLowerCase(), password, adminId]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505")
      throw Object.assign(new Error("Email is already in use"), {
        statusCode: 409,
      });
    throw error;
  }
};

export const getAdminDashboardService = async () => {
  const [totals, trend, recent] = await Promise.all([
    pool.query(`SELECT
      (SELECT COUNT(*)::int FROM users) AS "customers",
      (SELECT COUNT(*)::int FROM restaurants) AS "restaurants",
      (SELECT COUNT(*)::int FROM delivery_agents) AS "deliveryAgents",
      (SELECT COUNT(*)::int FROM restaurants WHERE approval_status='PENDING') AS "pendingRestaurants",
      (SELECT COUNT(*)::int FROM delivery_agents WHERE approval_status='PENDING') AS "pendingAgents",
      (SELECT COUNT(*)::int FROM categories) AS "categories",
      (SELECT COUNT(*)::int FROM foods) AS "foods",
      COUNT(*)::int AS "orders",
      COUNT(*) FILTER (WHERE status NOT IN ('DELIVERED','CANCELLED','REJECTED'))::int AS "activeOrders",
      COUNT(*) FILTER (WHERE status='DELIVERED')::int AS "deliveredOrders",
      COALESCE(SUM(total_amount) FILTER (WHERE status='DELIVERED'),0) AS "deliveredValue"
      FROM orders`),
    pool.query(`SELECT to_char(d.day,'YYYY-MM-DD') AS day,
      to_char(d.day,'Dy') AS label, COUNT(o.id)::int AS orders
      FROM generate_series(CURRENT_DATE - 6, CURRENT_DATE, '1 day'::interval) d(day)
      LEFT JOIN orders o ON o.created_at >= d.day AND o.created_at < d.day + interval '1 day'
      GROUP BY d.day ORDER BY d.day`),
    pool.query(`SELECT o.order_number AS "orderNumber", o.status, o.total_amount AS "totalAmount",
      o.created_at AS "createdAt", r.restaurant_name AS "restaurantName", og.delivery_name AS "customerName"
      FROM orders o JOIN restaurants r ON r.id=o.restaurant_id JOIN order_groups og ON og.id=o.order_group_id
      ORDER BY o.created_at DESC LIMIT 6`),
  ]);
  return {
    stats: totals.rows[0],
    trend: trend.rows,
    recentOrders: recent.rows,
    updatedAt: new Date().toISOString(),
  };
};

// Fixed query definitions keep table/column identifiers outside user input.
const adminLists = {
  foods: {
    from: "foods f JOIN restaurants r ON r.id=f.restaurant_id JOIN categories c ON c.id=f.category_id",
    fields: `f.slug, f.name, f.description, f.price, f.discount_price AS "discountPrice", f.image,
      f.is_veg AS "isVeg", f.is_available AS "isAvailable", f.preparation_time AS "preparationTime",
      f.created_at AS "createdAt", f.updated_at AS "updatedAt", c.name AS "categoryName",
      c.slug AS "categorySlug", r.restaurant_name AS "restaurantName", r.slug AS "restaurantSlug"`,
    search: "concat_ws(' ',f.name,r.restaurant_name,c.name)",
    status: null,
    date: "f.created_at",
  },
  restaurants: {
    from: "restaurants r",
    fields: `r.slug, r.restaurant_name AS "restaurantName", r.owner_name AS "ownerName", r.email,
      r.phone, r.logo, r.city, r.state, r.address_line AS "addressLine", r.pincode,
      r.approval_status AS "approvalStatus", r.is_open AS "isOpen", r.is_blocked AS "isBlocked",
      r.rejection_reason AS "rejectionReason", r.created_at AS "createdAt"`,
    search: "concat_ws(' ',r.restaurant_name,r.owner_name,r.email,r.city)",
    status: "r.approval_status",
    date: "r.created_at",
  },
  "delivery-agents": {
    from: "delivery_agents d",
    fields: `d.public_id AS "publicId", d.name, d.email, d.phone, d.image, d.vehicle_type AS "vehicleType",
      d.vehicle_number AS "vehicleNumber", d.address, d.approval_status AS "approvalStatus",
      d.is_online AS "isOnline", d.is_available AS "isAvailable", d.created_at AS "createdAt"`,
    search: "concat_ws(' ',d.name,d.email,d.phone,d.public_id)",
    status: "d.approval_status",
    date: "d.created_at",
  },
  orders: {
    from: "orders o JOIN restaurants r ON r.id=o.restaurant_id JOIN order_groups og ON og.id=o.order_group_id",
    fields: `o.order_number AS "orderNumber", o.status, o.total_amount AS "totalAmount", o.delivery_fee AS "deliveryFee",
      o.created_at AS "createdAt", r.restaurant_name AS "restaurantName", og.delivery_name AS "customerName",
      og.delivery_phone AS "customerPhone", og.payment_method AS "paymentMethod", og.payment_status AS "paymentStatus",
      og.address_line AS "addressLine", og.city, og.pincode`,
    search: "concat_ws(' ',o.order_number,r.restaurant_name,og.delivery_name)",
    status: "o.status",
    date: "o.created_at",
  },
  users: {
    from: "users u",
    fields: `u.id, u.name, u.email, u.phone, u.avatar, u.email_verified AS "emailVerified",
      u.is_blocked AS "isBlocked", u.created_at AS "createdAt"`,
    search: "concat_ws(' ',u.name,u.email,u.phone)",
    status: null,
    date: "u.created_at",
  },
};

export const getAdminListService = async (resource, query) => {
  const config = adminLists[resource];
  if (!config)
    throw Object.assign(new Error("Resource not found"), { statusCode: 404 });
  const page = Math.max(1, Math.trunc(Number(query.page) || 1));
  const limit = Math.min(
    100,
    Math.max(1, Math.trunc(Number(query.limit) || 15))
  );
  const values = [`%${String(query.search || "").slice(0, 150)}%`];
  let where = `${config.search} ILIKE $1`;
  if (config.status && query.status && query.status !== "ALL") {
    values.push(String(query.status));
    where += ` AND ${config.status} = $${values.length}`;
  }
  const count = await pool.query(
    `SELECT COUNT(*)::int AS total FROM ${config.from} WHERE ${where}`,
    values
  );
  const result = await pool.query(
    `SELECT ${config.fields} FROM ${config.from} WHERE ${where} ORDER BY ${
      config.date
    } DESC
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, (page - 1) * limit]
  );
  const total = count.rows[0].total;
  return {
    items: result.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

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
    [normalizedEmail]
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
    }
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
    `
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
    [adminId, restaurantSlug]
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
    [adminId, reason.trim(), restaurantSlug]
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
