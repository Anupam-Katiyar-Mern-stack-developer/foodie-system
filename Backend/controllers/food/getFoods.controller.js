import { getFoodsService } from "../../services/food.service.js";

export const getFoods = async (req, res, next) => {
  try {
    const result = await getFoodsService(req.query);
    console.log(result);

    return res.status(200).json({
      success: true,

      message: "Foods fetched successfully",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
