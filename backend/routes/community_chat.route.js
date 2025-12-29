import express from "express";
import {
    getAllMessages,
    getRecentMessages,
    getUserMessages,
} from "../controllers/community_chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

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
router.get("/:userId", protectRoute, getUserMessages);

export default router;

