import express from "express";
import { addFAQ, deleteFAQ, getFAQ } from "../controllers/faq.controller.js";
import {
  adminRoute,
  protectRoute,
  supportOrAdminRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Create FAQs
router.post("/create-faq", protectRoute, adminRoute, addFAQ);

// Get all FAQs
router.get("/get-faq", getFAQ);

// Delete FAQs by ID
router.post("/delete-faq", protectRoute, adminRoute, deleteFAQ);
export default router;
