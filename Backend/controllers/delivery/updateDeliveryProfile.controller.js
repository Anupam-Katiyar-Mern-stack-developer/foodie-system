import { updateDeliveryProfileService } from "../../services/delivery.service.js";

export const updateDeliveryProfile = async (req, res, next) => {
  try {
    const deliveryAgentId = req.deliveryAgent.deliveryAgentId;

    console.log("controller", deliveryAgentId);

    const { name, email, phone, vehicleType, vehicleNumber, address } =
      req.body;

    const profile = await updateDeliveryProfileService({
      deliveryAgentId,
      name,
      email,
      phone,

      vehicleType,
      vehicleNumber,

      address,
      imageFile: req.file || null,

      imageFolder: req.uploadFolder,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery agent profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
