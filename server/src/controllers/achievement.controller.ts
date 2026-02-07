import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { AchievementModel } from "../models/achievements.model";
import { editAchievementSchema, achievementSchema } from "./achievement.schema";
import { BAD_REQUEST, CREATED, OK } from "../constants/status-codes";

// get all achievements
const getAllAchievements = asyncHandler(async (req, res) => {
  const achievements = await AchievementModel.find();
  res.status(OK).json({ message: "fetched achievements successfully", success: true, achievements });
});

// add an achievement
const addAchievement = asyncHandler(async (req, res) => {
  const achievementData = achievementSchema.parse(req.body);
  const newAchievement = await AchievementModel.create(achievementData);
  if (!newAchievement) res.status(BAD_REQUEST).json({ message: "failed to add achievement", success: false });
  res.status(CREATED).json({ message: "achievement added successfully", success: true, achievement: newAchievement });
});

// edit an achievement by id
const editAchievementByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  const updates = editAchievementSchema.parse(req.body);
  const updatedAchievement = await AchievementModel.findByIdAndUpdate(ID, updates);
  res.status(OK).json({ message: "achievement updated successfully", success: true, achievement: updatedAchievement });
});

// delete an achievement by id
const deleteAchievementByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  await AchievementModel.findByIdAndDelete(ID);
  res.status(OK).json({ message: "achievement deleted successfully", success: true });
});

export { getAllAchievements, addAchievement, editAchievementByID, deleteAchievementByID };
