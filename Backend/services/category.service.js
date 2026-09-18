import pool from "../config/database.js";

import { generateCategorySlug } from "../utils/generateCategorySlug.js";

import { saveImage, deleteImage } from "../utils/storage/imageStorage.js";

// create category by admin
export const createCategoryService = async ({
  name,
  description,
  displayOrder,
  imageFile,
  imageFolder,
}) => {
  const normalizedName = name.trim();

  const slug = generateCategorySlug(normalizedName);

  // Check duplicate category
  const existingCategory = await pool.query(
    `
        SELECT id

        FROM categories

        WHERE slug = $1

        LIMIT 1
      `,
    [slug],
  );

  if (existingCategory.rows.length > 0) {
    const error = new Error("Category already exists");

    error.statusCode = 409;

    throw error;
  }

  // Duplicate check ke baad hi
  // image disk me save hogi
  const image = await saveImage({
    file: imageFile,
    folder: imageFolder,
  });

  try {
    const result = await pool.query(
      `
          INSERT INTO categories (
            name,
            slug,
            image,
            description,
            display_order
          )

          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
          )

          RETURNING
            name,
            slug,
            image,
            description,
            is_active AS "isActive",
            display_order AS "displayOrder",
            created_at AS "createdAt"
        `,
      [
        normalizedName,
        slug,
        image,

        description?.trim() || null,

        Number(displayOrder) || 0,
      ],
    );

    return result.rows[0];
  } catch (error) {
    // DB insert fail hua
    // to uploaded image bhi delete
    await deleteImage(image);

    throw error;
  }
};

//all category fetch for user
export const getPublicCategoriesService = async () => {
  const result = await pool.query(
    `
        SELECT 
        name,
        slug,
        image,
        description,
        display_order AS "displayOrder"

        FROM categories 

        WHERE is_active = TRUE

        ORDER BY 

          display_order ASC,
          created_at ASC  
        `,
  );
  return result.rows;
};

// fetch all category for admin

export const getAdminCategoriesService = async () => {
  const result = await pool.query(
    `
        SELECT 
          name ,
          slug,
          image,
          description,
          is_active AS "isActive",
          display_order AS "displayOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"

          FROM categories 

          ORDER BY
            display_order ASC,
            created_at DESC
        `,
  );

  return result.rows;
};

export const updateCategoryService = async ({
  categorySlug,
  name,
  description,
  displayOrder,
  imageFile,
  imageFolder,
}) => {
  // Current category find karo
  const existingResult = await pool.query(
    `
        SELECT
          id,
          name,
          slug,
          image,
          description,
          display_order AS "displayOrder"

        FROM categories

        WHERE slug = $1

        LIMIT 1
      `,
    [categorySlug],
  );

  if (existingResult.rows.length === 0) {
    const error = new Error("Category not found");

    error.statusCode = 404;

    throw error;
  }

  const existingCategory = existingResult.rows[0];

  let newSlug = existingCategory.slug;

  // Name change hua to slug bhi generate karo
  if (name !== undefined && name.trim() !== existingCategory.name) {
    newSlug = generateCategorySlug(name.trim());

    // Check new slug duplicate na ho
    const slugCheck = await pool.query(
      `
          SELECT id

          FROM categories

          WHERE slug = $1
          AND id <> $2

          LIMIT 1
        `,
      [newSlug, existingCategory.id],
    );

    if (slugCheck.rows.length > 0) {
      const error = new Error("Category with this name already exists");

      error.statusCode = 409;

      throw error;
    }
  }

  let newImage = null;

  // New image aayi hai to save karo
  if (imageFile) {
    newImage = await saveImage({
      file: imageFile,
      folder: imageFolder,
    });
  }

  try {
    const result = await pool.query(
      `
          UPDATE categories

          SET
            name = $1,
            slug = $2,
            description = $3,
            display_order = $4,
            image = $5,
            updated_at = CURRENT_TIMESTAMP

          WHERE id = $6

          RETURNING
            name,
            slug,
            image,
            description,
            is_active AS "isActive",
            display_order AS "displayOrder",
            updated_at AS "updatedAt"
        `,
      [
        name !== undefined ? name.trim() : existingCategory.name,

        newSlug,

        description !== undefined
          ? description.trim() || null
          : existingCategory.description,

        displayOrder !== undefined
          ? Number(displayOrder)
          : existingCategory.displayOrder,

        newImage || existingCategory.image,

        existingCategory.id,
      ],
    );

    const updatedCategory = result.rows[0];

    // DB update successful hone ke baad
    // old image delete karo
    if (newImage && existingCategory.image) {
      try {
        await deleteImage(existingCategory.image);
      } catch (error) {
        console.error("Old category image delete failed:", error.message);
      }
    }

    return updatedCategory;
  } catch (error) {
    // DB fail hua lekin new image save ho chuki thi
    // to new image clean karo
    if (newImage) {
      try {
        await deleteImage(newImage);
      } catch (deleteError) {
        console.error("New image cleanup failed:", deleteError.message);
      }
    }

    throw error;
  }
};
