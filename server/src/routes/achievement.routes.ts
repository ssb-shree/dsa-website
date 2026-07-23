import { Router } from "express";
import {
  createAchievement,
  deleteAchievementByID,
  getAllAchievements,
  updateAchievementByID,
} from "../controllers/achievement.controller";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllAchievements);

router.post("/", checkAuth, createAchievement);

router.put("/:id", checkAuth, updateAchievementByID);

router.delete("/:id", checkAuth, deleteAchievementByID);

export default router;