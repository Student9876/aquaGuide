import express from "express";
import {
  createCommunity,
  joinedCommunity,
  getPublicCommunities,
  joinCommunity,
  isMemberCommunity,
} from "../controllers/community_chat.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * REST API Routes for Community Chat
 * Note: Real-time message operations (send, edit, delete) are handled via WebSockets
 * Connect to WebSocket at: /api/community/chat
 */

// Public routes

// Protected routes

router.post("/createcommunity", protectRoute, adminRoute, createCommunity);
router.get("/getJoinedCommunity", protectRoute, joinedCommunity);

router.get("/public", getPublicCommunities);
router.post("/join/:id", protectRoute, joinCommunity);
router.get("/ismember/:id", protectRoute, isMemberCommunity);

export default router;
