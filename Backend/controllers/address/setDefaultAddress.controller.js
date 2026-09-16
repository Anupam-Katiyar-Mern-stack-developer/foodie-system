import { setDefaultAddressService } from "../../services/address.service.js";

export const setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { addressId } = req.params;

    const address = await setDefaultAddressService({
      userId,
      addressId,
    });

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};