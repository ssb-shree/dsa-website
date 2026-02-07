import { Router } from "express";

const router = Router();

import {
  getAllAchievements,
  addAchievement,
  editAchievementByID,
  deleteAchievementByID,
} from "../controllers/achievement.controller";

// get all achievements
router.get("/", getAllAchievements);

// add an achievement
router.post("/", addAchievement);

// edit an achievement by id
router.put("/:id", editAchievementByID);

// delete an achievement by id
router.delete("/:id", deleteAchievementByID);

export default router;
