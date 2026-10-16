import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

import { registerDeliveryTrackingSocket } from "./deliveryTracking.socket.js";

let ioInstance = null;

const getSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;

  if (authToken) {
    return authToken;
  }

  const authorization = socket.handshake.headers?.authorization;

  if (authorization?.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }

  return null;
};

const normalizeSocketUser = (decoded) => {
  return {
    role: decoded.role,
    userId: decoded.userId ?? (decoded.role === "user" ? decoded.id : null),
    restaurantId: decoded.restaurantId ?? null,
    deliveryAgentId: decoded.deliveryAgentId ?? null,
    deliveryAgentPublicId: decoded.publicId ?? null,
  };
};

const checkOrderAccess = async ({ user, orderNumber }) => {
  if (user.role === "user" && user.userId) {
    const result = await pool.query(
      `
        SELECT o.id
        FROM orders o
        INNER JOIN order_groups og ON og.id = o.order_group_id
        WHERE o.order_number = $1
          AND og.user_id = $2
        LIMIT 1
      `,
      [orderNumber, user.userId],
    );

    return result.rows.length > 0;
  }

  if (user.role === "restaurant" && user.restaurantId) {
    const result = await pool.query(
      `
        SELECT id
        FROM orders
        WHERE order_number = $1
          AND restaurant_id = $2
        LIMIT 1
      `,
      [orderNumber, user.restaurantId],
    );

    return result.rows.length > 0;
  }

  if (user.role === "deliveryAgent" && user.deliveryAgentId) {
    const result = await pool.query(
      `
        SELECT id
        FROM orders
        WHERE order_number = $1
          AND assigned_delivery_agent_id = $2
        LIMIT 1
      `,
      [orderNumber, user.deliveryAgentId],
    );

    return result.rows.length > 0;
  }

  return false;
};

export const initializeSocket = (httpServer) => {
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    try {
      const token = getSocketToken(socket);

      if (!token) {
        return next(new Error("Socket authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const socketUser = normalizeSocketUser(decoded);

      if (!socketUser.role) {
        return next(new Error("Invalid socket user role"));
      }

      socket.user = socketUser;
      next();
    } catch (error) {
      console.error("Socket auth error:", error.message);
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    console.log("Socket connected:", socket.id, user.role);

    if (user.role === "user" && user.userId) {
      socket.join(`user:${user.userId}`);
    }

    if (user.role === "restaurant" && user.restaurantId) {
      socket.join(`restaurant:${user.restaurantId}`);
    }

    if (user.role === "deliveryAgent" && user.deliveryAgentId) {
      socket.join(`delivery:${user.deliveryAgentId}`);
    }

    if (user.role === "deliveryAgent" && user.deliveryAgentPublicId) {
      socket.join(`delivery-public:${user.deliveryAgentPublicId}`);
    }

    // YAHAN ADD KARO
    registerDeliveryTrackingSocket(socket);

    socket.on("order:join", async ({ orderNumber }, callback) => {
      try {
        if (!orderNumber) {
          return callback?.({
            success: false,
            message: "Order number is required",
          });
        }

        const hasAccess = await checkOrderAccess({
          user,
          orderNumber,
        });

        if (!hasAccess) {
          return callback?.({
            success: false,
            message: "You are not allowed to access this order",
          });
        }

        const roomName = `order:${orderNumber}`;

        await socket.join(roomName);

        console.log(`${user.role} joined ${roomName}`);

        callback?.({
          success: true,
          message: "Order room joined",
          orderNumber,
        });
      } catch (error) {
        console.error("Order join socket error:", error.message);

        callback?.({
          success: false,
          message: "Failed to join order room",
        });
      }
    });

    socket.on("order:leave", async ({ orderNumber }) => {
      if (!orderNumber) return;

      await socket.leave(`order:${orderNumber}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
    });
  });

  ioInstance = io;

  console.log("Socket.IO initialized");

  return io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized");
  }

  return ioInstance;
};
