import { Server } from "socket.io";

let io = null;

export const intializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
    
  });

  io.on("connection", (socket) => {
    console.log("socket connected :", socket.id);

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected:", socket.id, reason);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new error("Socket.IO has not been initialized");
  }
  return io;
};
