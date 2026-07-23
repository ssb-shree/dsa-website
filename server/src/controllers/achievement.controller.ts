import type { Request, Response } from "express";
import { Achievement } from "../models/achivement.model";
import { createAchievementSchema, updateAchievementSchema } from "./highlight.schema";
import ApiError from "../utils/apiError";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Organization } from "../models/organization.model";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/status-codes";
import { User } from "../models/user.model";

export const getAllAchievements = async (_: Request, res: Response) => {
  const achievements = await Achievement.find().sort({ createdAt: -1 });

  res.status(200).json({
    achievements,
  });
};

export const createAchievement = async (req: AuthenticatedRequest, res: Response) => {
  const validated = createAchievementSchema.parse(req.body);

  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if such organization exist or not
  const organizationToUpdate = await Organization.findOne({ slug: "dsa" });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if authenticated user is in the organization
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied, you arent authorised to perform this action");

  const achievement = await Achievement.create(validated);

  res.status(201).json({
    achievement,
  });
};

export const updateAchievementByID = async (req: AuthenticatedRequest, res: Response) => {
  const validated = updateAchievementSchema.parse(req.body);

  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if such organization exist or not
  const organizationToUpdate = await Organization.findOne({ slug: "dsa" });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if authenticated user is in the organization
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied, you arent authorised to perform this action");

  const achievement = await Achievement.findByIdAndUpdate(req.params.id, validated, {
    new: true,
  });

  if (!achievement) {
    return res.status(404).json({
      message: "Achievement not found",
    });
  }

  res.status(200).json({
    achievement,
  });
};

export const deleteAchievementByID = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if such organization exist or not
  const organizationToUpdate = await Organization.findOne({ slug: "dsa" });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if authenticated user is in the organization
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied, you arent authorised to perform this action");

  const achievement = await Achievement.findByIdAndDelete(req.params.id);

  if (!achievement) {
    return res.status(404).json({
      message: "Achievement not found",
    });
  }

  res.status(200).json({
    message: "Achievement deleted",
  });
};
