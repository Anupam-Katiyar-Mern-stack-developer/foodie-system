import pool from "../config/database.js";

// add to cart service
export const addToCartService = async ({ userId, foodSlug, quantity }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Food validate karo
    const foodResult = await client.query(
      `
          SELECT
            f.id,
            f.name,
            f.slug,
            f.image,
            f.price,

            f.discount_price
              AS "discountPrice",

            f.restaurant_id
              AS "restaurantId",

            f.is_available
              AS "isAvailable",

            r.restaurant_name
              AS "restaurantName",

            r.slug
              AS "restaurantSlug",

            r.approval_status
              AS "restaurantApprovalStatus",

            r.is_blocked
              AS "restaurantIsBlocked",

            r.is_open
              AS "restaurantIsOpen",

            c.is_active
              AS "categoryIsActive"

          FROM foods f

          INNER JOIN restaurants r
            ON r.id = f.restaurant_id

          INNER JOIN categories c
            ON c.id = f.category_id

          WHERE f.slug = $1

          LIMIT 1
        `,
      [foodSlug],
    );

    if (foodResult.rows.length === 0) {
      const error = new Error("Food not found");

      error.statusCode = 404;
      throw error;
    }

    const food = foodResult.rows[0];

    if (!food.isAvailable) {
      const error = new Error("Food is currently unavailable");

      error.statusCode = 400;
      throw error;
    }

    if (!food.categoryIsActive) {
      const error = new Error("Food category is currently unavailable");

      error.statusCode = 400;
      throw error;
    }

    if (food.restaurantApprovalStatus !== "APPROVED") {
      const error = new Error("Restaurant is currently unavailable");

      error.statusCode = 400;
      throw error;
    }

    if (food.restaurantIsBlocked) {
      const error = new Error("Restaurant is currently unavailable");

      error.statusCode = 400;
      throw error;
    }

    if (!food.restaurantIsOpen) {
      const error = new Error("Restaurant is currently closed");

      error.statusCode = 400;
      throw error;
    }

    // 2. User ka cart find/create karo
    const cartResult = await client.query(
      `
          INSERT INTO carts (
            user_id
          )

          VALUES ($1)

          ON CONFLICT (user_id)

          DO UPDATE SET
            updated_at =
              CURRENT_TIMESTAMP

          RETURNING id
        `,
      [userId],
    );

    const cartId = cartResult.rows[0].id;

    // 3. Check karo same food pehle
    // cart me hai ya nahi
    const existingItemResult = await client.query(
      `
          SELECT
            id,
            quantity

          FROM cart_items

          WHERE
            cart_id = $1
            AND food_id = $2

          FOR UPDATE
        `,
      [cartId, food.id],
    );

    let finalQuantity;

    if (existingItemResult.rows.length > 0) {
      // Existing food ki quantity increase
      const existingItem = existingItemResult.rows[0];

      finalQuantity = existingItem.quantity + quantity;

      if (finalQuantity > 20) {
        const error = new Error(
          "Maximum quantity allowed for one food item is 20",
        );

        error.statusCode = 400;
        throw error;
      }

      await client.query(
        `
          UPDATE cart_items

          SET
            quantity = $1,
            updated_at =
              CURRENT_TIMESTAMP

          WHERE id = $2
        `,
        [finalQuantity, existingItem.id],
      );
    } else {
      finalQuantity = quantity;

      await client.query(
        `
          INSERT INTO cart_items (
            cart_id,
            food_id,
            quantity
          )

          VALUES (
            $1,
            $2,
            $3
          )
        `,
        [cartId, food.id, finalQuantity],
      );
    }

    // 4. Cart updated_at update
    await client.query(
      `
        UPDATE carts

        SET updated_at =
          CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [cartId],
    );

    await client.query("COMMIT");

    const actualPrice =
      food.discountPrice !== null
        ? Number(food.discountPrice)
        : Number(food.price);

    return {
      food: {
        name: food.name,
        slug: food.slug,
        image: food.image,

        price: Number(food.price),

        discountPrice:
          food.discountPrice !== null ? Number(food.discountPrice) : null,

        quantity: finalQuantity,

        itemTotal: Number((actualPrice * finalQuantity).toFixed(2)),
      },

      restaurant: {
        name: food.restaurantName,

        slug: food.restaurantSlug,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// get cart items
export const getCartService = async ({ userId }) => {
  const result = await pool.query(
    `
      SELECT
        ci.quantity,

        f.name AS "foodName",
        f.slug AS "foodSlug",
        f.image AS "foodImage",
        f.price,
        f.discount_price AS "discountPrice",
        f.is_available AS "isAvailable",

        r.restaurant_name AS "restaurantName",
        r.slug AS "restaurantSlug",
        r.logo AS "restaurantLogo",
        r.is_open AS "restaurantIsOpen",
        r.is_blocked AS "restaurantIsBlocked",
        r.approval_status AS "restaurantApprovalStatus",

        c.is_active AS "categoryIsActive"

      FROM carts cart

      INNER JOIN cart_items ci
        ON ci.cart_id = cart.id

      INNER JOIN foods f
        ON f.id = ci.food_id

      INNER JOIN restaurants r
        ON r.id = f.restaurant_id

      INNER JOIN categories c
        ON c.id = f.category_id

      WHERE cart.user_id = $1

      ORDER BY
        r.restaurant_name ASC,
        ci.created_at ASC
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    return {
      restaurants: [],
      totalItems: 0,
      grandTotal: 0,
    };
  }

  const restaurantMap = new Map();

  let totalItems = 0;
  let grandTotal = 0;

  for (const item of result.rows) {
    const price =
      item.discountPrice !== null
        ? Number(item.discountPrice)
        : Number(item.price);

    const itemTotal = Number((price * item.quantity).toFixed(2));

    totalItems += item.quantity;

    grandTotal += itemTotal;

    const foodAvailable =
      item.isAvailable &&
      item.categoryIsActive &&
      !item.restaurantIsBlocked &&
      item.restaurantApprovalStatus === "APPROVED";

    if (!restaurantMap.has(item.restaurantSlug)) {
      restaurantMap.set(item.restaurantSlug, {
        restaurantName: item.restaurantName,

        restaurantSlug: item.restaurantSlug,

        restaurantLogo: item.restaurantLogo,

        isOpen: item.restaurantIsOpen,

        subtotal: 0,

        items: [],
      });
    }

    const restaurant = restaurantMap.get(item.restaurantSlug);

    restaurant.items.push({
      name: item.foodName,

      slug: item.foodSlug,

      image: item.foodImage,

      price: Number(item.price),

      discountPrice:
        item.discountPrice !== null ? Number(item.discountPrice) : null,

      quantity: item.quantity,

      itemTotal,

      isAvailable: foodAvailable,
    });

    restaurant.subtotal += itemTotal;
  }

  const restaurants = Array.from(restaurantMap.values()).map((restaurant) => ({
    ...restaurant,

    subtotal: Number(restaurant.subtotal.toFixed(2)),
  }));

  return {
    restaurants,

    totalItems,

    grandTotal: Number(grandTotal.toFixed(2)),
  };
};

// update cart service

export const updateCartItemService = async ({ userId, foodSlug, quantity }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const itemResult = await client.query(
      `
          SELECT
            ci.id AS "cartItemId",
            ci.cart_id AS "cartId",

            f.name,
            f.slug,
            f.image,
            f.price,

            f.discount_price
              AS "discountPrice",

            r.restaurant_name
              AS "restaurantName",

            r.slug
              AS "restaurantSlug"

          FROM cart_items ci

          INNER JOIN carts c
            ON c.id = ci.cart_id

          INNER JOIN foods f
            ON f.id = ci.food_id

          INNER JOIN restaurants r
            ON r.id = f.restaurant_id

          WHERE
            c.user_id = $1
            AND f.slug = $2

          LIMIT 1

          FOR UPDATE OF ci
        `,
      [userId, foodSlug],
    );

    if (itemResult.rows.length === 0) {
      const error = new Error("Food is not in your cart");

      error.statusCode = 404;
      throw error;
    }

    const item = itemResult.rows[0];

    await client.query(
      `
        UPDATE cart_items

        SET
          quantity = $1,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = $2
      `,
      [quantity, item.cartItemId],
    );

    await client.query(
      `
        UPDATE carts

        SET updated_at =
          CURRENT_TIMESTAMP

        WHERE id = $1
      `,
      [item.cartId],
    );

    await client.query("COMMIT");

    const actualPrice =
      item.discountPrice !== null
        ? Number(item.discountPrice)
        : Number(item.price);

    return {
      name: item.name,

      slug: item.slug,

      image: item.image,

      price: Number(item.price),

      discountPrice:
        item.discountPrice !== null ? Number(item.discountPrice) : null,

      quantity,

      itemTotal: Number((actualPrice * quantity).toFixed(2)),

      restaurant: {
        name: item.restaurantName,

        slug: item.restaurantSlug,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// remove cart item service
export const removeCartItemService = async ({ userId, foodSlug }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // User ke cart me food find karo
    const itemResult = await client.query(
      `
          SELECT
            ci.id AS "cartItemId",
            ci.cart_id AS "cartId",

            f.name,
            f.slug,
            f.image,

            r.restaurant_name
              AS "restaurantName",

            r.slug
              AS "restaurantSlug"

          FROM cart_items ci

          INNER JOIN carts c
            ON c.id = ci.cart_id

          INNER JOIN foods f
            ON f.id = ci.food_id

          INNER JOIN restaurants r
            ON r.id = f.restaurant_id

          WHERE
            c.user_id = $1
            AND f.slug = $2

          LIMIT 1

          FOR UPDATE OF ci
        `,
      [userId, foodSlug],
    );

    if (itemResult.rows.length === 0) {
      const error = new Error("Food is not in your cart");

      error.statusCode = 404;
      throw error;
    }

    const item = itemResult.rows[0];

    // Cart item delete
    await client.query(
      `
        DELETE FROM cart_items

        WHERE id = $1
      `,
      [item.cartItemId],
    );

    // Check cart me aur items hain?
    const remainingResult = await client.query(
      `
          SELECT COUNT(*)::int
            AS "remainingItems"

          FROM cart_items

          WHERE cart_id = $1
        `,
      [item.cartId],
    );

    const remainingItems = remainingResult.rows[0].remainingItems;

    /*
      Agar last item remove hua,
      empty cart row bhi hata do.
    */
    if (remainingItems === 0) {
      await client.query(
        `
          DELETE FROM carts

          WHERE
            id = $1
            AND user_id = $2
        `,
        [item.cartId, userId],
      );
    } else {
      await client.query(
        `
          UPDATE carts

          SET updated_at =
            CURRENT_TIMESTAMP

          WHERE id = $1
        `,
        [item.cartId],
      );
    }

    await client.query("COMMIT");

    return {
      removedFood: {
        name: item.name,

        slug: item.slug,

        image: item.image,

        restaurant: {
          name: item.restaurantName,

          slug: item.restaurantSlug,
        },
      },

      remainingItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

// all cart clear
export const clearCartService = async ({ userId }) => {
  const result = await pool.query(
    `
      DELETE FROM carts

      WHERE user_id = $1

      RETURNING
        id
    `,
    [userId],
  );

  /*
    Cart already empty / exist nahi karta,
    tab bhi clear cart ko successful
    response de sakte hain.
  */
  return {
    cleared: result.rows.length > 0,
  };
};
