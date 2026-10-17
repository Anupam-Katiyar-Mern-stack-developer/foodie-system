import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  transports: ["websocket", "polling"],
});

export const connectSocket = (token) => {
  if (!token) {
    console.warn("Socket connection skipped: token missing");
    return;
  }

  const currentToken = socket.auth?.token;

  if (socket.connected && currentToken === token) {
    return;
  }

  if (socket.connected) {
    socket.disconnect();
  }

  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }

  socket.auth = {};
};

export default socket;
