import express from "express";
import { approve_or_reject_rejection_request,
        approve_or_reject_text, get_all_guides,
        get_text_guide,
        get_text_guide_by_id,
        post_text_guide,
        approve_or_reject_for_support,
        bulk_action_text_guides,
        update_text_guide,
        delete_text_guide} from "../controllers/text_guide.controller.js";
import { adminRoute,
        protectRoute,
        supportOnlyRoute, 
        supportOrAdminRoute,
        canEditGuideMiddleware} from "../middleware/auth.middleware.js";


const router = express.Router();

//Public_view
router.post("/text_guide", protectRoute, post_text_guide)
router.get("/get_all_guides", get_text_guide)
router.get("/get_text_guide/:id", get_text_guide_by_id)

//admin view
router.get("/all_text_guides",protectRoute,supportOrAdminRoute, get_all_guides)
router.put("/approve_or_reject/:id",protectRoute, adminRoute, approve_or_reject_text)
router.put("/approve_or_deny_rejection_request/:id",protectRoute, adminRoute, approve_or_reject_rejection_request)

//support view
router.put("/approve_or_reject_text_guide/:id",protectRoute, supportOnlyRoute, approve_or_reject_for_support)

router.post(
  "/text_guides/bulk_action",
  protectRoute,
  adminRoute,
  bulk_action_text_guides
);
router.put(
  "/text_guide/:id",
  protectRoute,
  canEditGuideMiddleware, // admin OR owner
  update_text_guide
);
router.delete(
  "/text_guide/:id",
  protectRoute,
  adminRoute,
  delete_text_guide
);

export default router;