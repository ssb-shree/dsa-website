import { Router } from "express";
import {
  createHighlight,
  deleteHighlightByID,
  getAllHighlights,
  updateHighlightByID,
} from "../controllers/highlight.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHighlights);

router.post("/", checkAuth, createHighlight);

router.put("/:id", checkAuth, updateHighlightByID);

router.delete("/:id", checkAuth, deleteHighlightByID);

export default router;