import { createAddressService } from "../../services/address.service.js";

export const createAddress = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const {
      label,
      addressLine,
      landmark,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    } = req.body;

    if (
      !label ||
      !addressLine ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required address fields are missing",
      });
    }

    const address =
      await createAddressService({
        userId,
        label,
        addressLine,
        landmark,
        city,
        state,
        pincode,
        latitude,
        longitude,
        isDefault,
      });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};