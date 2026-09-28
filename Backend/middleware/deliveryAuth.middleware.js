import jwt from "jsonwebtoken";

export const deliveryAuthMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Delivery agent authentication required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Delivery token is required",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    if (
      decoded.role !==
      "deliveryAgent"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Delivery agent access only",
      });
    }

    req.deliveryAgent = {
      deliveryAgentId:
        decoded.deliveryAgentId,

      publicId:
        decoded.publicId,

      role:
        decoded.role,
    };

    next();

  } catch (error) {

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Delivery token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid delivery token",
    });
  }
};