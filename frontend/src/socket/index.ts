import { io } from "socket.io-client";
import config from "../api/config";

export const socket = io(`${config.baseUrl}/api/community/chat`, {
  auth: {
    userId: localStorage.getItem("userId"), // TEMP (JWT later)
  },
  autoConnect: false, // IMPORTANT
  transports: ["websocket"],
});
