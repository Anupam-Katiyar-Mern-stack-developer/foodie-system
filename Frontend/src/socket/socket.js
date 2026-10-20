import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export const connectSocket = (token) => {
  if (!token) return;

  if (socket.auth?.token === token && socket.active) {
    return socket;
  }

  socket.disconnect();
  socket.auth = { token };
  socket.connect();

  return socket;
};

export const disconnectSocket = () => {
  socket.disconnect();
  socket.auth = {};
};
