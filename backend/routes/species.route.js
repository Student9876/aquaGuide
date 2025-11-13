import express from "express";
import {
  addSpecies,
  editSpecies,
  deleteSpecies,
  getSpeciesManagement,
} from "../controllers/manageSpecies.controller.js";
import { protectRoute, supportOrAdminRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/species-management",
  protectRoute,
  supportOrAdminRoute,
  getSpeciesManagement
);

router.post(
  "/species-management/new",
  protectRoute,
  supportOrAdminRoute,
  addSpecies
);

router.put(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  editSpecies
);

router.delete(
  "/species-management/:fish_id",
  protectRoute,
  supportOrAdminRoute,
  deleteSpecies
);

export default router;
