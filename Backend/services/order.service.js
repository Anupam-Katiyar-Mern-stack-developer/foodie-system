import pool from "../config/database.js";

import {
  generateCheckoutNumber,
  generateOrderNumber,
} from "../utils/generateOrderNumber.js";

export const placeOrderService = async ({
  userId,
  addressId,
  paymentMethod,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
     * 1. Delivery address + user
     */

    const addressResult = await client.query(
      `
          SELECT
            u.name,
            u.phone,

            a.address_line
              AS "addressLine",

            a.landmark,
            a.city,
            a.state,
            a.pincode,
            a.latitude,
            a.longitude

          FROM addresses a

          INNER JOIN users u
            ON u.id = a.user_id

          WHERE
            a.id = $1
            AND a.user_id = $2

          LIMIT 1
        `,
      [addressId, userId],
    );

    if (addressResult.rows.length === 0) {
      const error = new Error("Delivery address not found");

      error.statusCode = 404;
      throw error;
    }

    const address = addressResult.rows[0];

    if (!address.phone) {
      const error = new Error(
        "Please add your phone number before placing an order",
      );

      error.statusCode = 400;
      throw error;
    }

    /*
     * 2. Cart ko lock karo
     */

    const cartResult = await client.query(
      `
          SELECT id

          FROM carts

          WHERE user_id = $1

          LIMIT 1

          FOR UPDATE
        `,
      [userId],
    );

    if (cartResult.rows.length === 0) {
      const error = new Error("Your cart is empty");

      error.statusCode = 400;
      throw error;
    }

    const cart = cartResult.rows[0];

    /*
     * 3. Complete cart data DB se lao
     */

    const cartItemsResult = await client.query(
      `
          SELECT
            ci.quantity,

            f.id AS "foodId",
            f.name AS "foodName",
            f.slug AS "foodSlug",
            f.image AS "foodImage",

            f.price,
            f.discount_price
              AS "discountPrice",

            f.is_available
              AS "foodIsAvailable",

            f.restaurant_id
              AS "restaurantId",

            r.restaurant_name
              AS "restaurantName",

            r.slug
              AS "restaurantSlug",

            r.is_open
              AS "restaurantIsOpen",

            r.is_blocked
              AS "restaurantIsBlocked",

            r.approval_status
              AS "restaurantApprovalStatus",

            c.is_active
              AS "categoryIsActive"

          FROM cart_items ci

          INNER JOIN foods f
            ON f.id = ci.food_id

          INNER JOIN restaurants r
            ON r.id =
               f.restaurant_id

          INNER JOIN categories c
            ON c.id =
               f.category_id

          WHERE ci.cart_id = $1

          ORDER BY
            f.restaurant_id ASC,
            ci.created_at ASC
        `,
      [cart.id],
    );

    if (cartItemsResult.rows.length === 0) {
      const error = new Error("Your cart is empty");

      error.statusCode = 400;
      throw error;
    }

    /*
     * 4. Restaurant-wise grouping
     */

    const restaurantGroups = new Map();

    for (const item of cartItemsResult.rows) {
      if (!item.foodIsAvailable) {
        const error = new Error(`${item.foodName} is currently unavailable`);

        error.statusCode = 409;
        throw error;
      }

      if (!item.categoryIsActive) {
        const error = new Error(
          `${item.foodName} category is currently unavailable`,
        );

        error.statusCode = 409;
        throw error;
      }

      if (item.restaurantApprovalStatus !== "APPROVED") {
        const error = new Error(
          `${item.restaurantName} is currently unavailable`,
        );

        error.statusCode = 409;
        throw error;
      }

      if (item.restaurantIsBlocked) {
        const error = new Error(
          `${item.restaurantName} is currently unavailable`,
        );

        error.statusCode = 409;
        throw error;
      }

      if (!item.restaurantIsOpen) {
        const error = new Error(`${item.restaurantName} is currently closed`);

        error.statusCode = 409;
        throw error;
      }

      const unitPrice =
        item.discountPrice !== null
          ? Number(item.discountPrice)
          : Number(item.price);

      const itemTotal = Number((unitPrice * item.quantity).toFixed(2));

      if (!restaurantGroups.has(item.restaurantId)) {
        restaurantGroups.set(item.restaurantId, {
          restaurantId: item.restaurantId,

          restaurantName: item.restaurantName,

          restaurantSlug: item.restaurantSlug,

          subtotal: 0,

          items: [],
        });
      }

      const group = restaurantGroups.get(item.restaurantId);

      group.items.push({
        foodId: item.foodId,

        foodName: item.foodName,

        foodSlug: item.foodSlug,

        foodImage: item.foodImage,

        unitPrice,
        quantity: item.quantity,

        itemTotal,
      });

      group.subtotal += itemTotal;
    }

    /*
     * 5. Grand Total calculate
     */

    let grandTotal = 0;

    for (const group of restaurantGroups.values()) {
      group.subtotal = Number(group.subtotal.toFixed(2));

      grandTotal += group.subtotal;
    }

    grandTotal = Number(grandTotal.toFixed(2));

    /*
     * Abhi delivery fee + tax = 0.
     * Later settings/distance module se aayega.
     */

    /*
     * 6. Order Group create
     */

    const checkoutNumber = generateCheckoutNumber();

    const orderGroupResult = await client.query(
      `
          INSERT INTO order_groups (
            checkout_number,
            user_id,

            delivery_name,
            delivery_phone,

            address_line,
            landmark,
            city,
            state,
            pincode,

            latitude,
            longitude,

            payment_method,
            payment_status,

            grand_total
          )

          VALUES (
            $1, $2,
            $3, $4,
            $5, $6,
            $7, $8, $9,
            $10, $11,
            $12, $13,
            $14
          )

          RETURNING id
        `,
      [
        checkoutNumber,
        userId,

        address.name,
        address.phone,

        address.addressLine,
        address.landmark,

        address.city,
        address.state,
        address.pincode,

        address.latitude,
        address.longitude,

        paymentMethod,

        paymentMethod === "COD" ? "PENDING" : "PENDING",

        grandTotal,
      ],
    );

    const orderGroupId = orderGroupResult.rows[0].id;

    /*
     * 7. Har restaurant ka
     * separate order create
     */

    const createdOrders = [];

    for (const group of restaurantGroups.values()) {
      const orderNumber = generateOrderNumber();

      const deliveryFee = 0;
      const taxAmount = 0;

      const totalAmount = Number(
        (group.subtotal + deliveryFee + taxAmount).toFixed(2),
      );

      const orderResult = await client.query(
        `
            INSERT INTO orders (
              order_group_id,
              restaurant_id,
              order_number,

              status,

              subtotal,
              delivery_fee,
              tax_amount,
              total_amount
            )

            VALUES (
              $1, $2, $3,
              'PLACED',
              $4, $5, $6, $7
            )

            RETURNING id
          `,
        [
          orderGroupId,
          group.restaurantId,
          orderNumber,

          group.subtotal,
          deliveryFee,
          taxAmount,
          totalAmount,
        ],
      );

      const orderId = orderResult.rows[0].id;

      /*
       * 8. Us restaurant ke
       * order items insert
       */

      for (const item of group.items) {
        await client.query(
          `
            INSERT INTO order_items (
              order_id,
              food_id,

              food_name,
              food_slug,
              food_image,

              unit_price,
              quantity,
              item_total
            )

            VALUES (
              $1, $2,
              $3, $4, $5,
              $6, $7, $8
            )
          `,
          [
            orderId,
            item.foodId,

            item.foodName,
            item.foodSlug,
            item.foodImage,

            item.unitPrice,
            item.quantity,
            item.itemTotal,
          ],
        );
      }

      createdOrders.push({
        orderNumber,

        restaurant: {
          name: group.restaurantName,

          slug: group.restaurantSlug,
        },

        status: "PLACED",

        subtotal: group.subtotal,

        deliveryFee,

        taxAmount,

        totalAmount,

        items: group.items.map((item) => ({
          name: item.foodName,

          slug: item.foodSlug,

          image: item.foodImage,

          unitPrice: item.unitPrice,

          quantity: item.quantity,

          itemTotal: item.itemTotal,
        })),
      });
    }

    /*
     * 9. Sab orders successfully
     * ban gaye tab cart delete
     */

    await client.query(
      `
        DELETE FROM carts

        WHERE
          id = $1
          AND user_id = $2
      `,
      [cart.id, userId],
    );

    /*
      cart delete hote hi
      cart_items ON DELETE CASCADE
      se automatically delete.
    */

    await client.query("COMMIT");

    return {
      checkoutNumber,

      paymentMethod,

      paymentStatus: "PENDING",

      grandTotal,

      totalRestaurantOrders: createdOrders.length,

      orders: createdOrders,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// get user order service

export const getUserOrdersService = async ({ userId, page, limit }) => {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::int AS total

      FROM orders o

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE og.user_id = $1
    `,
    [userId],
  );

  const result = await pool.query(
    `
      SELECT
        o.order_number AS "orderNumber",
        o.status,

        o.subtotal,
        o.delivery_fee AS "deliveryFee",
        o.tax_amount AS "taxAmount",
        o.total_amount AS "totalAmount",

        o.created_at AS "createdAt",
        o.updated_at AS "updatedAt",

        og.checkout_number AS "checkoutNumber",
        og.payment_method AS "paymentMethod",
        og.payment_status AS "paymentStatus",

        r.restaurant_name AS "restaurantName",
        r.slug AS "restaurantSlug",
        r.logo AS "restaurantLogo"

      FROM orders o

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      INNER JOIN restaurants r
        ON r.id = o.restaurant_id

      WHERE og.user_id = $1

      ORDER BY o.created_at DESC

      LIMIT $2
      OFFSET $3
    `,
    [userId, limit, offset],
  );

  const total = countResult.rows[0].total;

  return {
    orders: result.rows,

    pagination: {
      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

// get single order service

export const getUserOrderByNumberService = async ({ userId, orderNumber }) => {
  const orderResult = await pool.query(
    `
        SELECT
          o.id,
          o.order_number AS "orderNumber",
          o.status,

          o.subtotal,
          o.delivery_fee AS "deliveryFee",
          o.tax_amount AS "taxAmount",
          o.total_amount AS "totalAmount",

          o.rejection_reason AS "rejectionReason",
          o.cancelled_reason AS "cancelledReason",

          o.confirmed_at AS "confirmedAt",
          o.preparing_at AS "preparingAt",
          o.ready_at AS "readyAt",
          o.picked_up_at AS "pickedUpAt",
          o.delivered_at AS "deliveredAt",
          o.cancelled_at AS "cancelledAt",

          o.created_at AS "createdAt",
          o.updated_at AS "updatedAt",

          og.checkout_number AS "checkoutNumber",

          og.payment_method AS "paymentMethod",
          og.payment_status AS "paymentStatus",

          og.delivery_name AS "deliveryName",
          og.delivery_phone AS "deliveryPhone",

          og.address_line AS "addressLine",
          og.landmark,
          og.city,
          og.state,
          og.pincode,

          og.latitude,
          og.longitude,

          r.restaurant_name AS "restaurantName",
          r.slug AS "restaurantSlug",
          r.logo AS "restaurantLogo"

        FROM orders o

        INNER JOIN order_groups og
          ON og.id = o.order_group_id

        INNER JOIN restaurants r
          ON r.id = o.restaurant_id

        WHERE
          o.order_number = $1
          AND og.user_id = $2

        LIMIT 1
      `,
    [orderNumber, userId],
  );

  if (orderResult.rows.length === 0) {
    const error = new Error("Order not found");

    error.statusCode = 404;
    throw error;
  }

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `
        SELECT
          food_name AS "name",
          food_slug AS "slug",
          food_image AS "image",

          unit_price AS "unitPrice",
          quantity,
          item_total AS "itemTotal"

        FROM order_items

        WHERE order_id = $1

        ORDER BY id ASC
      `,
    [order.id],
  );

  /*
    Internal database id frontend ko
    return nahi karna.
  */
  delete order.id;

  return {
    ...order,

    items: itemsResult.rows,
  };
};

// get restaurant order service
export const getRestaurantOrdersService = async ({
  restaurantId,
  page,
  limit,
  status,
}) => {
  const offset = (page - 1) * limit;

  const allowedStatuses = [
    "PLACED",
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "DELIVERY_ASSIGNED",
    "PICKED_UP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "REJECTED",
    "CANCELLED",
  ];

  if (status && !allowedStatuses.includes(status)) {
    const error = new Error("Invalid order status");

    error.statusCode = 400;
    throw error;
  }

  const values = [restaurantId];

  let statusCondition = "";

  if (status) {
    values.push(status);

    statusCondition = `
      AND o.status = $${values.length}
    `;
  }

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::int AS total

      FROM orders o

      WHERE
        o.restaurant_id = $1
        ${statusCondition}
    `,
    values,
  );

  const queryValues = [...values];

  queryValues.push(limit);

  const limitPosition = queryValues.length;

  queryValues.push(offset);

  const offsetPosition = queryValues.length;

  const result = await pool.query(
    `
      SELECT
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

        o.created_at
          AS "createdAt",

        og.checkout_number
          AS "checkoutNumber",

        og.payment_method
          AS "paymentMethod",

        og.payment_status
          AS "paymentStatus",

        og.delivery_name
          AS "customerName",

        (
          SELECT COUNT(*)::int
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS "totalItems"

      FROM orders o

      INNER JOIN order_groups og
        ON og.id = o.order_group_id

      WHERE
        o.restaurant_id = $1
        ${statusCondition}

      ORDER BY
        o.created_at DESC

      LIMIT $${limitPosition}
      OFFSET $${offsetPosition}
    `,
    queryValues,
  );

  const total = countResult.rows[0].total;

  return {
    orders: result.rows,

    pagination: {
      page,
      limit,
      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

// get restaurant order by number service

export const getRestaurantOrderByNumberService = async ({
  restaurantId,
  orderNumber,
}) => {
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

          o.rejection_reason
            AS "rejectionReason",

          o.cancelled_reason
            AS "cancelledReason",

          o.confirmed_at
            AS "confirmedAt",

          o.preparing_at
            AS "preparingAt",

          o.ready_at
            AS "readyAt",

          o.picked_up_at
            AS "pickedUpAt",

          o.delivered_at
            AS "deliveredAt",

          o.cancelled_at
            AS "cancelledAt",

          o.created_at
            AS "createdAt",

          og.checkout_number
            AS "checkoutNumber",

          og.payment_method
            AS "paymentMethod",

          og.payment_status
            AS "paymentStatus",

          og.delivery_name
            AS "deliveryName",

          og.delivery_phone
            AS "deliveryPhone",

          og.address_line
            AS "addressLine",

          og.landmark,
          og.city,
          og.state,
          og.pincode

        FROM orders o

        INNER JOIN order_groups og
          ON og.id = o.order_group_id

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

// accept restaurant order service
export const acceptRestaurantOrderService = async ({
  restaurantId,
  orderNumber,
}) => {
  const result = await pool.query(
    `
      UPDATE orders

      SET
        status = 'CONFIRMED',

        confirmed_at =
          CURRENT_TIMESTAMP,

        updated_at =
          CURRENT_TIMESTAMP

      WHERE
        order_number = $1
        AND restaurant_id = $2
        AND status = 'PLACED'

      RETURNING
        order_number AS "orderNumber",
        status,

        confirmed_at
          AS "confirmedAt"
    `,
    [orderNumber, restaurantId],
  );

  if (result.rows.length === 0) {
    const existing = await pool.query(
      `
          SELECT status

          FROM orders

          WHERE
            order_number = $1
            AND restaurant_id = $2

          LIMIT 1
        `,
      [orderNumber, restaurantId],
    );

    if (existing.rows.length === 0) {
      const error = new Error("Order not found");

      error.statusCode = 404;

      throw error;
    }

    const error = new Error(
      `Order cannot be accepted from ${existing.rows[0].status} status`,
    );

    error.statusCode = 409;

    throw error;
  }

  return result.rows[0];
};

// reject restaurant order service
export const rejectRestaurantOrderService = async ({
  restaurantId,
  orderNumber,
  reason,
}) => {
  const result = await pool.query(
    `
        UPDATE orders

        SET
          status = 'REJECTED',

          rejection_reason = $1,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE
          order_number = $2
          AND restaurant_id = $3
          AND status = 'PLACED'

        RETURNING
          order_number
            AS "orderNumber",

          status,

          rejection_reason
            AS "rejectionReason",

          updated_at
            AS "updatedAt"
      `,
    [reason, orderNumber, restaurantId],
  );

  if (result.rows.length === 0) {
    const existing = await pool.query(
      `
          SELECT status

          FROM orders

          WHERE
            order_number = $1
            AND restaurant_id = $2

          LIMIT 1
        `,
      [orderNumber, restaurantId],
    );

    if (existing.rows.length === 0) {
      const error = new Error("Order not found");

      error.statusCode = 404;

      throw error;
    }

    const error = new Error(
      `Order cannot be rejected from ${existing.rows[0].status} status`,
    );

    error.statusCode = 409;

    throw error;
  }

  return result.rows[0];
};

// marked order prepariong service
export const markOrderPreparingService = async ({
  restaurantId,
  orderNumber,
}) => {
  const result = await pool.query(
    `
        UPDATE orders

        SET
          status = 'PREPARING',

          preparing_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE
          order_number = $1
          AND restaurant_id = $2
          AND status = 'CONFIRMED'

        RETURNING
          order_number
            AS "orderNumber",

          status,

          preparing_at
            AS "preparingAt"
      `,
    [orderNumber, restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Only confirmed orders can be moved to preparing");

    error.statusCode = 409;

    throw error;
  }

  return result.rows[0];
};

// marked order ready service

export const markOrderReadyService = async ({ restaurantId, orderNumber }) => {
  const result = await pool.query(
    `
        UPDATE orders

        SET
          status =
            'READY_FOR_PICKUP',

          ready_at =
            CURRENT_TIMESTAMP,

          updated_at =
            CURRENT_TIMESTAMP

        WHERE
          order_number = $1
          AND restaurant_id = $2
          AND status = 'PREPARING'

        RETURNING
          order_number
            AS "orderNumber",

          status,

          ready_at
            AS "readyAt"
      `,
    [orderNumber, restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Only preparing orders can be marked ready");

    error.statusCode = 409;

    throw error;
  }

  return result.rows[0];
};
