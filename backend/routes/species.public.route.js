import express from "express";
import {
  getSpeciesDictionary,
  getSpeciesDetail,
  apiSpeciesSearch,
  apiSpeciesSuggestions,
} from "../controllers/speciesPublic.controller.js";

const router = express.Router();

router.get("/species-dictionary", getSpeciesDictionary);
router.get("/species/:id", getSpeciesDetail);

// Public APIs
router.get("/public/species/search", apiSpeciesSearch);
router.get("/public/species/suggestions", apiSpeciesSuggestions);

export default router;
