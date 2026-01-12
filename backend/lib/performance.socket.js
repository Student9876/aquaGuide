import { performanceMonitor } from "../services/performance.monitor.js";

export const setupPerformanceSocket = (io) => {
  const nsp = io.of("/performance");

  nsp.on("connection", (socket) => {
    console.log("[Performance WS] connected:", socket.id);

    const interval = setInterval(async () => {
      const metrics = await performanceMonitor.collect();
      socket.emit("metrics", metrics);
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("[Performance WS] disconnected:", socket.id);
    });
  });
};
