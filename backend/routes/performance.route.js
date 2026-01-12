import express from "express";
import {
  getMetrics,
  getHistory,
  getSummary,
} from "../controllers/performance.controller.js";

const router = express.Router();

router.get("/metrics", getMetrics);
router.get("/history", getHistory);
router.get("/summary", getSummary);

export default router;
