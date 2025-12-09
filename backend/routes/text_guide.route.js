import express from "express";
import { approve_or_reject_for_support, approve_or_reject_rejection_request, approve_or_reject_text, get_all_guides, get_text_guide, get_text_guide_by_id, post_text_guide } from "../controllers/text_guide.controller";
import { adminRoute, protectRoute, supportOnlyRoute, supportOrAdminRoute } from "../middleware/auth.middleware";


const router = express.Router();

//Public_view
router.post("/text_guide", protectRoute, post_text_guide)
router.get("/get_all_guides", get_text_guide)
router.get("/get_text_guide/:id", get_text_guide_by_id)

//admin view
router.get("/all_text_guides",supportOrAdminRoute, get_all_guides)
router.put("/approve_or_reject/:id", adminRoute, approve_or_reject_text)
router.put("/approve_or_deny_rejection_request/:id", adminRoute, approve_or_reject_rejection_request)

//support view
router.put("/approve_or_reject_text_guide/:id", supportOnlyRoute, approve_or_reject_for_support)