import {
  getAdminFoodsService,
} from "../../services/food.service.js";

export const getFoods = async (
  req,
  res,
  next
) => {
  try {
    const page =
      Math.max(
        Number.parseInt(
          req.query.page
        ) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          Number.parseInt(
            req.query.limit
          ) || 20,
          1
        ),
        100
      );

    const result =
      await getAdminFoodsService({
        page,
        limit,
      });

    return res.status(200).json({
      success: true,
      message:
        "Foods fetched successfully",

      data:
        result.foods,

      pagination:
        result.pagination,
    });

  } catch (error) {
    next(error);
  }
};