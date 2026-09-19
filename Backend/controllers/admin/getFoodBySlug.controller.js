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