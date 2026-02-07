import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { AchivementModel } from "../models/achivements.model";
import { editAchivementSchema, achivementSchema } from "./achivement.schema";
import { BAD_REQUEST, CREATED, OK } from "../constants/status-codes";

// get all achivements
const getAllAchivements = asyncHandler(async (req, res) => {
  const achivements = await AchivementModel.find();
  res.status(OK).json({ message: "fetched achivements successfully", success: true, achivements });
});

// add an achivement
const addAchivement = asyncHandler(async (req, res) => {
  const achivementData = achivementSchema.parse(req.body);
  const newAchivement = await AchivementModel.create(achivementData);
  if (!newAchivement) res.status(BAD_REQUEST).json({ message: "failed to add achivement", success: false });
  res.status(CREATED).json({ message: "achivement added successfully", success: true, achivement: newAchivement });
});

// edit an achivement by id
const editAchivementByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  const updates = editAchivementSchema.parse(req.body);
  const updatedAchivement = await AchivementModel.findByIdAndUpdate(ID, updates);
  res.status(OK).json({ message: "achivement updated successfully", success: true, achivement: updatedAchivement });
});

// delete an achivement by id
const deleteAchivementByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  await AchivementModel.findByIdAndDelete(ID);
  res.status(OK).json({ message: "achivement deleted successfully", success: true });
});

export { getAllAchivements, addAchivement, editAchivementByID, deleteAchivementByID };
