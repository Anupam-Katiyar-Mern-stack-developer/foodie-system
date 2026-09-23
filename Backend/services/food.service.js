import pool from "../config/database.js";

import { generateFoodSlug } from "../utils/generateFoodSlug.js";

import { saveImage, deleteImage } from "../utils/storage/imageStorage.js";

// create food by restaurant
export const createFoodService = async ({
  restaurantId,

  name,
  categorySlug,
  description,

  price,
  discountPrice,

  isVeg,
  preparationTime,

  imageFile,
  imageFolder,
}) => {
  const normalizedName = name.trim();

  /*
    Restaurant abhi bhi approved hai
    aur blocked nahi hai?
  */
  const restaurantResult = await pool.query(
    `
        SELECT
          id,
          restaurant_name AS "restaurantName",
          approval_status AS "approvalStatus",
          is_blocked AS "isBlocked"

        FROM restaurants

        WHERE id = $1

        LIMIT 1
      `,
    [restaurantId],
  );

  if (restaurantResult.rows.length === 0) {
    const error = new Error("Restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  const restaurant = restaurantResult.rows[0];

  if (restaurant.approvalStatus !== "APPROVED") {
    const error = new Error("Only approved restaurants can create food items");

    error.statusCode = 403;
    throw error;
  }

  if (restaurant.isBlocked) {
    const error = new Error("Restaurant account is blocked");

    error.statusCode = 403;
    throw error;
  }

  /*
    Category slug se internal category id find
  */
  const categoryResult = await pool.query(
    `
        SELECT
          id,
          name,
          slug

        FROM categories

        WHERE slug = $1
        AND is_active = TRUE

        LIMIT 1
      `,
    [categorySlug.trim()],
  );

  if (categoryResult.rows.length === 0) {
    const error = new Error("Active category not found");

    error.statusCode = 404;
    throw error;
  }

  const category = categoryResult.rows[0];

  /*
    Same restaurant me same food name
    duplicate na ho
  */
  const duplicateFood = await pool.query(
    `
        SELECT id

        FROM foods

        WHERE restaurant_id = $1
        AND LOWER(name) = LOWER($2)

        LIMIT 1
      `,
    [restaurantId, normalizedName],
  );

  if (duplicateFood.rows.length > 0) {
    const error = new Error("Food item already exists in your restaurant");

    error.statusCode = 409;
    throw error;
  }

  const numericPrice = Number(price);

  const numericDiscountPrice =
    discountPrice !== undefined &&
    discountPrice !== "" &&
    discountPrice !== null
      ? Number(discountPrice)
      : null;

  if (
    numericDiscountPrice !== null &&
    (numericDiscountPrice <= 0 || numericDiscountPrice >= numericPrice)
  ) {
    const error = new Error(
      "Discount price must be greater than 0 and less than regular price",
    );

    error.statusCode = 400;
    throw error;
  }

  const slug = generateFoodSlug(normalizedName);

  /*
    Saari validations ke baad image save
  */
  const image = await saveImage({
    file: imageFile,
    folder: imageFolder,
  });

  try {
    const result = await pool.query(
      `
          INSERT INTO foods (
            restaurant_id,
            category_id,
            name,
            slug,
            description,
            price,
            discount_price,
            image,
            is_veg,
            preparation_time
          )

          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10
          )

          RETURNING
            name,
            slug,
            description,
            price,
            discount_price AS "discountPrice",
            image,
            is_veg AS "isVeg",
            is_available AS "isAvailable",
            preparation_time AS "preparationTime",
            created_at AS "createdAt"
        `,
      [
        restaurantId,
        category.id,

        normalizedName,
        slug,

        description?.trim() || null,

        numericPrice,

        numericDiscountPrice,

        image,

        isVeg !== undefined ? isVeg === true || isVeg === "true" : true,

        preparationTime ? Number(preparationTime) : null,
      ],
    );

    const food = result.rows[0];

    /*
      Frontend ko category information bhi
      useful rahegi.
    */
    return {
      ...food,

      category: {
        name: category.name,
        slug: category.slug,
      },

      restaurant: {
        name: restaurant.restaurantName,
      },
    };
  } catch (error) {
    /*
      DB fail ho gaya to orphan image
      nahi chhodenge
    */
    try {
      await deleteImage(image);
    } catch (deleteError) {
      console.error("Food image cleanup failed:", deleteError.message);
    }

    throw error;
  }
};

// get restaurant food service

export const getRestaurantFoodsService = async ({
  restaurantId,
  page,
  limit,
}) => {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `
      SELECT COUNT(*)::int AS total
      FROM foods
      WHERE restaurant_id = $1
    `,
    [restaurantId],
  );

  const result = await pool.query(
    `
      SELECT
        f.name,
        f.slug,
        f.description,
        f.price,
        f.discount_price AS "discountPrice",
        f.image,
        f.is_veg AS "isVeg",
        f.is_available AS "isAvailable",
        f.preparation_time AS "preparationTime",

        c.name AS "categoryName",
        c.slug AS "categorySlug",

        f.created_at AS "createdAt",
        f.updated_at AS "updatedAt"

      FROM foods f

      INNER JOIN categories c
        ON c.id = f.category_id

      WHERE f.restaurant_id = $1

      ORDER BY f.created_at DESC

      LIMIT $2
      OFFSET $3
    `,
    [restaurantId, limit, offset],
  );

  const total = countResult.rows[0].total;

  return {
    foods: result.rows,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//get restaurant single food
export const getRestaurantFoodBySlugService = async ({
  restaurantId,
  foodSlug,
}) => {
  const result = await pool.query(
    `
      SELECT
        f.name,
        f.slug,
        f.description,
        f.price,
        f.discount_price AS "discountPrice",
        f.image,
        f.is_veg AS "isVeg",
        f.is_available AS "isAvailable",
        f.preparation_time AS "preparationTime",

        c.name AS "categoryName",
        c.slug AS "categorySlug",

        f.created_at AS "createdAt",
        f.updated_at AS "updatedAt"

      FROM foods f

      INNER JOIN categories c
        ON c.id = f.category_id

      WHERE
        f.slug = $1
        AND f.restaurant_id = $2

      LIMIT 1
    `,
    [
      foodSlug,
      restaurantId,
    ]
  );

  if (result.rows.length === 0) {
    const error =
      new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

//update food service
export const updateFoodService = async ({
  restaurantId,
  foodSlug,

  name,
  categorySlug,
  description,

  price,
  discountPrice,

  isVeg,
  isAvailable,
  preparationTime,

  imageFile,
  imageFolder,
}) => {
  const existingResult =
    await pool.query(
      `
        SELECT
          id,
          category_id AS "categoryId",
          name,
          slug,
          description,
          price,
          discount_price AS "discountPrice",
          image,
          is_veg AS "isVeg",
          is_available AS "isAvailable",
          preparation_time AS "preparationTime"

        FROM foods

        WHERE
          slug = $1
          AND restaurant_id = $2

        LIMIT 1
      `,
      [
        foodSlug,
        restaurantId,
      ]
    );

  if (existingResult.rows.length === 0) {
    const error =
      new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  const existingFood =
    existingResult.rows[0];


  /*
   * Final Name
   */

  const finalName =
    name !== undefined
      ? name.trim()
      : existingFood.name;

  if (!finalName) {
    const error =
      new Error("Food name is required");

    error.statusCode = 400;
    throw error;
  }


  /*
   * Duplicate food name check
   */

  if (
    finalName.toLowerCase() !==
    existingFood.name.toLowerCase()
  ) {
    const duplicateResult =
      await pool.query(
        `
          SELECT id

          FROM foods

          WHERE
            restaurant_id = $1
            AND LOWER(name) = LOWER($2)
            AND id <> $3

          LIMIT 1
        `,
        [
          restaurantId,
          finalName,
          existingFood.id,
        ]
      );

    if (
      duplicateResult.rows.length > 0
    ) {
      const error = new Error(
        "Food item already exists in your restaurant"
      );

      error.statusCode = 409;
      throw error;
    }
  }


  /*
   * Category
   */

  let finalCategoryId =
    existingFood.categoryId;

  if (categorySlug !== undefined) {
    const categoryResult =
      await pool.query(
        `
          SELECT id

          FROM categories

          WHERE
            slug = $1
            AND is_active = TRUE

          LIMIT 1
        `,
        [categorySlug.trim()]
      );

    if (
      categoryResult.rows.length === 0
    ) {
      const error =
        new Error(
          "Active category not found"
        );

      error.statusCode = 404;
      throw error;
    }

    finalCategoryId =
      categoryResult.rows[0].id;
  }


  /*
   * Price
   */

  const finalPrice =
    price !== undefined
      ? Number(price)
      : Number(existingFood.price);

  if (
    !Number.isFinite(finalPrice) ||
    finalPrice <= 0
  ) {
    const error =
      new Error("Invalid food price");

    error.statusCode = 400;
    throw error;
  }


  /*
   * Discount Price
   */

  let finalDiscountPrice =
    existingFood.discountPrice !== null
      ? Number(
          existingFood.discountPrice
        )
      : null;

  if (discountPrice !== undefined) {
    finalDiscountPrice =
      discountPrice === "" ||
      discountPrice === null
        ? null
        : Number(discountPrice);
  }

  if (
    finalDiscountPrice !== null &&
    (
      !Number.isFinite(
        finalDiscountPrice
      ) ||
      finalDiscountPrice <= 0 ||
      finalDiscountPrice >= finalPrice
    )
  ) {
    const error = new Error(
      "Discount price must be greater than 0 and less than regular price"
    );

    error.statusCode = 400;
    throw error;
  }


  /*
   * Boolean values
   */

  const parseBoolean = (
    value,
    oldValue
  ) => {
    if (value === undefined) {
      return oldValue;
    }

    if (
      value === true ||
      value === "true"
    ) {
      return true;
    }

    if (
      value === false ||
      value === "false"
    ) {
      return false;
    }

    const error =
      new Error(
        "Boolean value must be true or false"
      );

    error.statusCode = 400;
    throw error;
  };


  const finalIsVeg =
    parseBoolean(
      isVeg,
      existingFood.isVeg
    );

  const finalIsAvailable =
    parseBoolean(
      isAvailable,
      existingFood.isAvailable
    );


  /*
   * Preparation time
   */

  let finalPreparationTime =
    existingFood.preparationTime;

  if (preparationTime !== undefined) {
    if (
      preparationTime === "" ||
      preparationTime === null
    ) {
      finalPreparationTime = null;
    } else {
      finalPreparationTime =
        Number(preparationTime);

      if (
        !Number.isInteger(
          finalPreparationTime
        ) ||
        finalPreparationTime <= 0
      ) {
        const error = new Error(
          "Preparation time must be a positive integer"
        );

        error.statusCode = 400;
        throw error;
      }
    }
  }


  /*
   * Image
   */

  let newImage = null;

  if (imageFile) {
    newImage = await saveImage({
      file: imageFile,
      folder: imageFolder,
    });
  }


  try {
    const result =
      await pool.query(
        `
          UPDATE foods

          SET
            category_id = $1,
            name = $2,
            description = $3,
            price = $4,
            discount_price = $5,
            image = $6,
            is_veg = $7,
            is_available = $8,
            preparation_time = $9,
            updated_at =
              CURRENT_TIMESTAMP

          WHERE
            id = $10
            AND restaurant_id = $11

          RETURNING
            name,
            slug,
            description,
            price,
            discount_price
              AS "discountPrice",
            image,
            is_veg
              AS "isVeg",
            is_available
              AS "isAvailable",
            preparation_time
              AS "preparationTime",
            updated_at
              AS "updatedAt"
        `,
        [
          finalCategoryId,
          finalName,

          description !== undefined
            ? description.trim() || null
            : existingFood.description,

          finalPrice,
          finalDiscountPrice,

          newImage ||
            existingFood.image,

          finalIsVeg,
          finalIsAvailable,
          finalPreparationTime,

          existingFood.id,
          restaurantId,
        ]
      );

    if (
      newImage &&
      existingFood.image
    ) {
      try {
        await deleteImage(
          existingFood.image
        );
      } catch (error) {
        console.error(
          "Old food image delete failed:",
          error.message
        );
      }
    }

    return result.rows[0];

  } catch (error) {
    if (newImage) {
      try {
        await deleteImage(newImage);
      } catch (deleteError) {
        console.error(
          "New food image cleanup failed:",
          deleteError.message
        );
      }
    }

    throw error;
  }
};

//delete food service 
export const deleteFoodService = async ({
  restaurantId,
  foodSlug,
}) => {
  const result = await pool.query(
    `
      DELETE FROM foods

      WHERE
        slug = $1
        AND restaurant_id = $2

      RETURNING
        name,
        slug,
        image
    `,
    [
      foodSlug,
      restaurantId,
    ]
  );

  if (result.rows.length === 0) {
    const error =
      new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  const deletedFood =
    result.rows[0];

  if (deletedFood.image) {
    try {
      await deleteImage(
        deletedFood.image
      );
    } catch (error) {
      console.error(
        "Food image delete failed:",
        error.message
      );
    }
  }

  return {
    name: deletedFood.name,
    slug: deletedFood.slug,
  };
};

// get adminfood service
export const getAdminFoodsService = async ({
  page,
  limit,
}) => {
  const offset =
    (page - 1) * limit;

  const countResult =
    await pool.query(
      `
        SELECT COUNT(*)::int AS total
        FROM foods
      `
    );

  const result =
    await pool.query(
      `
        SELECT
          f.name,
          f.slug,
          f.description,
          f.price,
          f.discount_price
            AS "discountPrice",
          f.image,
          f.is_veg
            AS "isVeg",
          f.is_available
            AS "isAvailable",
          f.preparation_time
            AS "preparationTime",

          c.name
            AS "categoryName",
          c.slug
            AS "categorySlug",

          r.restaurant_name
            AS "restaurantName",
          r.slug
            AS "restaurantSlug",

          f.created_at
            AS "createdAt",
          f.updated_at
            AS "updatedAt"

        FROM foods f

        INNER JOIN categories c
          ON c.id = f.category_id

        INNER JOIN restaurants r
          ON r.id =
             f.restaurant_id

        ORDER BY
          f.created_at DESC

        LIMIT $1
        OFFSET $2
      `,
      [
        limit,
        offset,
      ]
    );

  const total =
    countResult.rows[0].total;

  return {
    foods:
      result.rows,

    pagination: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};

// get single food by admin
export const getAdminFoodBySlugService = async ({
  foodSlug,
}) => {
  const result =
    await pool.query(
      `
        SELECT
          f.name,
          f.slug,
          f.description,
          f.price,
          f.discount_price
            AS "discountPrice",
          f.image,
          f.is_veg
            AS "isVeg",
          f.is_available
            AS "isAvailable",
          f.preparation_time
            AS "preparationTime",

          c.name
            AS "categoryName",
          c.slug
            AS "categorySlug",

          r.restaurant_name
            AS "restaurantName",
          r.slug
            AS "restaurantSlug",

          r.approval_status
            AS "restaurantApprovalStatus",

          f.created_at
            AS "createdAt",
          f.updated_at
            AS "updatedAt"

        FROM foods f

        INNER JOIN categories c
          ON c.id =
             f.category_id

        INNER JOIN restaurants r
          ON r.id =
             f.restaurant_id

        WHERE f.slug = $1

        LIMIT 1
      `,
      [foodSlug]
    );

  if (
    result.rows.length === 0
  ) {
    const error =
      new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// get food by category service

export const getFoodsByCategoryService = async ({
  categorySlug,
  page,
  limit,
}) => {
  const offset = (page - 1) * limit;

  // Category active hai ya nahi
  const categoryResult = await pool.query(
    `
      SELECT
        id,
        name,
        slug,
        image,
        description

      FROM categories

      WHERE
        slug = $1
        AND is_active = TRUE

      LIMIT 1
    `,
    [categorySlug]
  );

  if (categoryResult.rows.length === 0) {
    const error = new Error(
      "Category not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const category =
    categoryResult.rows[0];


  // Total foods count
  const countResult = await pool.query(
    `
      SELECT COUNT(*)::int AS total

      FROM foods f

      INNER JOIN restaurants r
        ON r.id = f.restaurant_id

      WHERE
        f.category_id = $1
        AND f.is_available = TRUE
        AND r.approval_status = 'APPROVED'
        AND r.is_blocked = FALSE
    `,
    [category.id]
  );


  // Actual foods
  const result = await pool.query(
    `
      SELECT
        f.name,
        f.slug,
        f.description,
        f.price,

        f.discount_price
          AS "discountPrice",

        f.image,

        f.is_veg
          AS "isVeg",

        f.is_available
          AS "isAvailable",

        f.preparation_time
          AS "preparationTime",

        r.restaurant_name
          AS "restaurantName",

        r.slug
          AS "restaurantSlug",

        r.logo
          AS "restaurantLogo",

        r.city,

        r.is_open
          AS "restaurantIsOpen"

      FROM foods f

      INNER JOIN restaurants r
        ON r.id = f.restaurant_id

      WHERE
        f.category_id = $1
        AND f.is_available = TRUE
        AND r.approval_status = 'APPROVED'
        AND r.is_blocked = FALSE

      ORDER BY
        f.created_at DESC

      LIMIT $2
      OFFSET $3
    `,
    [
      category.id,
      limit,
      offset,
    ]
  );


  const total =
    countResult.rows[0].total;

  return {
    category: {
      name: category.name,
      slug: category.slug,
      image: category.image,
      description:
        category.description,
    },

    foods: result.rows,

    pagination: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(
          total / limit
        ),
    },
  };
};