import { createAddressService } from "../../services/address.service.js";
import { geocodeAddress } from "../../utils/geocodeAddress.js";

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

    if (!label || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Required address fields are missing",
      });
    }

    const coordinates = await geocodeAddress({
      addressLine,
      landmark,
      city,
      state,
      pincode,
    });

    const address = await createAddressService({
      userId,
      label,
      addressLine,
      landmark,
      city,
      state,
      pincode,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
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
