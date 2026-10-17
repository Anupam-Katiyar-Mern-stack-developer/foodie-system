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
  if (!token) {
    console.error("Socket token missing");

    return;
  }

  // Same token ke saath already connected
  if (socket.connected && socket.auth?.token === token) {
    return;
  }

  // Agar dusre token ke saath connection hai
  // to fresh connection banao
  if (socket.connected) {
    socket.disconnect();
  }

  socket.auth = {
    token,
  };

  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
