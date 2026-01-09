import express from "express";
import {
  getAllMessages,
  getRecentMessages,
  getUserMessages,
  getChatStatistics,
  createCommunity,
  joinedCommunity,
} from "../controllers/community_chat.controller.js";
import {
  adminRoute,
  protectRoute,
  supportOrAdminRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * REST API Routes for Community Chat
 * Note: Real-time message operations (send, edit, delete) are handled via WebSockets
 * Connect to WebSocket at: /api/community/chat
 */

// Public routes
router.get("/recent", getRecentMessages);

// Protected routes
router.get("/", protectRoute, getAllMessages);
router.post("/createcommunity", protectRoute, adminRoute, createCommunity);
router.get("/getJoinedCommunity", protectRoute, joinedCommunity);
router.get("/:userId", protectRoute, getUserMessages);

export default router;
