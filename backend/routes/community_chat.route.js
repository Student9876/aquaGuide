import express from "express";
import {
    getAllMessages,
    getRecentMessages,
    getUserMessages,
    getChatStatistics,
} from "../controllers/community_chat.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * REST API Routes for Community Chat
 * Note: Real-time message operations (send, edit, delete) are handled via WebSockets
 * Connect to WebSocket at: /api/community/chat
 */

// Public routes
router.get("/recent", getRecentMessages);
router.get("/stats", getChatStatistics);

// Protected routes
router.get("/", isAuthenticated, getAllMessages);
router.get("/:userId", isAuthenticated, getUserMessages);

export default router;

