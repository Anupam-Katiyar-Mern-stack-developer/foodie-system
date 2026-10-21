import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Admin authentication token is required",
        });
    }
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    if (decoded.role !== "SUPER_ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Admin access only" });
    }
    const { rows } = await pool.query(
      "SELECT id FROM admins WHERE id=$1 AND role='SUPER_ADMIN' AND is_blocked=FALSE",
      [decoded.adminId]
    );
    if (!rows[0]) {
      return res
        .status(401)
        .json({ success: false, message: "Admin account unavailable" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    if (
      ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired admin token" });
    }
    next(error);
  }
};
