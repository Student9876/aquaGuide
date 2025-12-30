import express from "express";
import {
  getSpeciesDictionary,
  getSpeciesDetail,
  apiSpeciesSearch,
  apiSpeciesSuggestions,
} from "../controllers/speciesPublic.controller.js";

const router = express.Router();

// Get full species dictionary
router.get("/species-dictionary", getSpeciesDictionary);



// Get species detail by ID
router.get("/species/:id", getSpeciesDetail);



// Search species
router.get("/public/species/search", apiSpeciesSearch);



// Get species suggestions
router.get("/public/species/suggestions", apiSpeciesSuggestions);

export default router;
