import { io } from "socket.io-client";

const socket = io("http://localhost:5000/performance");

socket.on("metrics", data => {
  console.log("Live metrics:", data);
});
