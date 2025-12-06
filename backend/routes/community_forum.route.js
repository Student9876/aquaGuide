import express from "express"
import { get_community_form_by_id, get_community_forum } from "../controllers/community_forum.controller"
import { protectRoute, supportOrAdminRoute } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/get_all_community_forums", get_community_forum)
router.get("/get_communtiy_form_by_id/:id", get_community_form_by_id)
router.post("/add_community_forum", supportOrAdminRoute, create)