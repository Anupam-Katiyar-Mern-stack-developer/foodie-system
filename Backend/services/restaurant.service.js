import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { restaurantRegisteredTemplate } from "../templates/restaurant/restaurantRegistered.template.js";
import { generateSlug } from "../utils/generateSlug.js";

// register restaurant
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

  const slug = generateSlug(restaurantName, city);

  const result = await pool.query(
    `
        INSERT INTO restaurants(
        owner_name,
        restaurant_name,
        slug,
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
        $7, $8, $9, $10, $11, $12,$13
        )

        RETURNING
        id,
        owner_name AS "ownerName",
        restaurant_name AS "restaurantName",
        slug,
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
      slug,
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
    ownerName: restaurant.ownerName,
    restaurantName: restaurant.restaurantName,
    email: restaurant.email,
  });

  try {
    await sendEmail({
      to: restaurant.email,
      ...template,
    });
    console.log("Restaurant registration email sent:", restaurant.email);
  } catch (error) {
    console.error("Restaurant registration email failed:", error.message);
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

// get restaurant profile service
export const getRestaurantProfileService = async ({ restaurantId }) => {
  console.log("restaurantId in service :", restaurantId);

  const result = await pool.query(
    `
      SELECT
        id,
        owner_name AS "ownerName",
        restaurant_name AS "restaurantName",
        slug,
        email,
        phone,
        description,
        logo,
        banner,
        address_line AS "addressLine",
        city,
        state,
        pincode,
        latitude,
        longitude,
        opening_time AS "openingTime",
        closing_time AS "closingTime",
        is_open AS "isOpen",
        approval_status AS "approvalStatus",
        email_verified AS "emailVerified",
        is_blocked AS "isBlocked",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM restaurants
      WHERE id = $1
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

//update profile  service
export const updateRestaurantProfileService = async ({
  restaurantId,
  data,
}) => {
  const allowedFields = {
    ownerName: "owner_name",
    restaurantName: "restaurant_name",
    description: "description",
    addressLine: "address_line",
    city: "city",
    state: "state",
    pincode: "pincode",
    latitude: "latitude",
    longitude: "longitude",
    openingTime: "opening_time",
    closingTime: "closing_time",
  };

  const updates = [];
  const values = [];

  for (const [key, column] of Object.entries(allowedFields)) {
    if (data[key] !== undefined) {
      values.push(data[key]);

      updates.push(`${column} = $${values.length}`);
    }
  }

  if (updates.length === 0) {
    const error = new Error("No valid profile fields provided");

    error.statusCode = 400;
    throw error;
  }

  values.push(restaurantId);

  const restaurantIdPosition = values.length;

  const result = await pool.query(
    `
      UPDATE restaurants

      SET
        ${updates.join(", ")},
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $${restaurantIdPosition}

      RETURNING
        owner_name AS "ownerName",
        restaurant_name AS "restaurantName",
        slug,
        email,
        phone,
        description,
        logo,
        banner,
        address_line AS "addressLine",
        city,
        state,
        pincode,
        latitude,
        longitude,
        opening_time AS "openingTime",
        closing_time AS "closingTime",
        is_open AS "isOpen",
        approval_status AS "approvalStatus",
        email_verified AS "emailVerified",
        is_blocked AS "isBlocked",
        updated_at AS "updatedAt"
    `,
    values,
  );

  if (result.rows.length === 0) {
    const error = new Error("Restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

//update restaurant status service
export const updateRestaurantStatusService = async ({
  restaurantId,
  isOpen,
}) => {
  const result = await pool.query(
    `
      UPDATE restaurants

      SET
        is_open = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2
        AND approval_status = 'APPROVED'
        AND is_blocked = FALSE

      RETURNING
        restaurant_name AS "restaurantName",
        slug,
        is_open AS "isOpen",
        approval_status AS "approvalStatus",
        updated_at AS "updatedAt"
    `,
    [isOpen, restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error(
      "Approved restaurant not found or restaurant is blocked",
    );

    error.statusCode = 403;
    throw error;
  }

  return result.rows[0];
};

// getFoodRestaurant Service
export const getRestaurantFoodService = async ({
  restaurantId,
  page,
  limit,
}) => {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `
    SELECT COUNT(*) ::int AS total
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
      f.isAvailable AS "isAvailable",
      f.preparation_time AS "preparationTime",

      c.name AS "categoryName",
      c.slug AS "categorySlug",

       f.created_at AS "createdAt",
        f.updated_at AS "updatedAt"

        FROM foods f

        INNER JOIN category c

        ON c.id = f.category_id

        WHERE f.restaurant_id =$1 

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

// getRestaurantFood by slug Service
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
    f.discount_price, AS "discountPrice",
    f.image,
    f.is_Available AS "isAvailable",
    f.preparation_time AS "preparationTime",

    c.name  AS "isVeg",
    f.is_Available AS "isAvailable",
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
    [foodSlug, restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error("food not found");

    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// update food service
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
  const existingResult = await pool.query(
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
    [foodSlug, restaurantId],
  );

  if (existingResult.rows.length === 0) {
    const error = new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  const existingFood = existingResult.rows[0];

  /*
   * Final Name
   */

  const finalName = name !== undefined ? name.trim() : existingFood.name;

  if (!finalName) {
    const error = new Error("Food name is required");

    error.statusCode = 400;
    throw error;
  }

  /*
   * Duplicate food name check
   */

  if (finalName.toLowerCase() !== existingFood.name.toLowerCase()) {
    const duplicateResult = await pool.query(
      `
          SELECT id

          FROM foods

          WHERE
            restaurant_id = $1
            AND LOWER(name) = LOWER($2)
            AND id <> $3

          LIMIT 1
        `,
      [restaurantId, finalName, existingFood.id],
    );

    if (duplicateResult.rows.length > 0) {
      const error = new Error("Food item already exists in your restaurant");

      error.statusCode = 409;
      throw error;
    }
  }

  /*
   * Category
   */

  let finalCategoryId = existingFood.categoryId;

  if (categorySlug !== undefined) {
    const categoryResult = await pool.query(
      `
          SELECT id

          FROM categories

          WHERE
            slug = $1
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

    finalCategoryId = categoryResult.rows[0].id;
  }

  /*
   * Price
   */

  const finalPrice =
    price !== undefined ? Number(price) : Number(existingFood.price);

  if (!Number.isFinite(finalPrice) || finalPrice <= 0) {
    const error = new Error("Invalid food price");

    error.statusCode = 400;
    throw error;
  }

  /*
   * Discount Price
   */

  let finalDiscountPrice =
    existingFood.discountPrice !== null
      ? Number(existingFood.discountPrice)
      : null;

  if (discountPrice !== undefined) {
    finalDiscountPrice =
      discountPrice === "" || discountPrice === null
        ? null
        : Number(discountPrice);
  }

  if (
    finalDiscountPrice !== null &&
    (!Number.isFinite(finalDiscountPrice) ||
      finalDiscountPrice <= 0 ||
      finalDiscountPrice >= finalPrice)
  ) {
    const error = new Error(
      "Discount price must be greater than 0 and less than regular price",
    );

    error.statusCode = 400;
    throw error;
  }

  /*
   * Boolean values
   */

  const parseBoolean = (value, oldValue) => {
    if (value === undefined) {
      return oldValue;
    }

    if (value === true || value === "true") {
      return true;
    }

    if (value === false || value === "false") {
      return false;
    }

    const error = new Error("Boolean value must be true or false");

    error.statusCode = 400;
    throw error;
  };

  const finalIsVeg = parseBoolean(isVeg, existingFood.isVeg);

  const finalIsAvailable = parseBoolean(isAvailable, existingFood.isAvailable);

  /*
   * Preparation time
   */

  let finalPreparationTime = existingFood.preparationTime;

  if (preparationTime !== undefined) {
    if (preparationTime === "" || preparationTime === null) {
      finalPreparationTime = null;
    } else {
      finalPreparationTime = Number(preparationTime);

      if (
        !Number.isInteger(finalPreparationTime) ||
        finalPreparationTime <= 0
      ) {
        const error = new Error("Preparation time must be a positive integer");

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
    const result = await pool.query(
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

        newImage || existingFood.image,

        finalIsVeg,
        finalIsAvailable,
        finalPreparationTime,

        existingFood.id,
        restaurantId,
      ],
    );

    if (newImage && existingFood.image) {
      try {
        await deleteImage(existingFood.image);
      } catch (error) {
        console.error("Old food image delete failed:", error.message);
      }
    }

    return result.rows[0];
  } catch (error) {
    if (newImage) {
      try {
        await deleteImage(newImage);
      } catch (deleteError) {
        console.error("New food image cleanup failed:", deleteError.message);
      }
    }

    throw error;
  }
};

// delete food by restauratnt
export const deleteFoodService = async ({ restaurantId, foodSlug }) => {
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
    [foodSlug, restaurantId],
  );

  if (result.rows.length === 0) {
    const error = new Error("Food not found");

    error.statusCode = 404;
    throw error;
  }

  const deletedFood = result.rows[0];

  if (deletedFood.image) {
    try {
      await deleteImage(deletedFood.image);
    } catch (error) {
      console.error("Food image delete failed:", error.message);
    }
  }

  return {
    name: deletedFood.name,
    slug: deletedFood.slug,
  };
};

// get public restaurant by slug service
export const getPublicRestaurantBySlugService = async ({ restaurantSlug }) => {
  const result = await pool.query(
    `
      SELECT
        restaurant_name AS "restaurantName",
        slug,
        description,
        logo,
        banner,

        address_line AS "addressLine",
        city,
        state,
        pincode,

        latitude,
        longitude,

        opening_time AS "openingTime",
        closing_time AS "closingTime",

        is_open AS "isOpen"

      FROM restaurants

      WHERE
        slug = $1
        AND approval_status = 'APPROVED'
        AND is_blocked = FALSE

      LIMIT 1
    `,
    [restaurantSlug],
  );

  if (result.rows.length === 0) {
    const error = new Error("Restaurant not found");

    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};
