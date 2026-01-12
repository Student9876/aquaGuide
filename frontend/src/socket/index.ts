import { io } from "socket.io-client";
import config from "../api/config";

export const socket = io(`${config.baseUrl}/api/community/chat`, {
  auth: {
    userId: localStorage.getItem("id"), // TEMP (JWT later)
  },
  autoConnect: true, // IMPORTANT
  transports: ["websocket"],
});
