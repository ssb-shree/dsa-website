import asyncHandler from "../utils/asyncHandler";

import ApiError from "../utils/apiError";

import { MemberModel } from "../models/team.model";
import { editMemberSchema, memberSchema } from "./team.schema";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/status-codes";

//get all members array
const getAllMembers = asyncHandler(async (req, res) => {
  const members = await MemberModel.find();

  res.status(OK).json({ message: "fetched members successfully", success: true, members });
});

//add a doc to member array
const addMember = asyncHandler(async (req, res) => {
  const memberData = memberSchema.parse(req.body);

  const newMember = await MemberModel.create(memberData);

  if (!newMember) res.status(500).json({ message: "failed to add member", success: false });

  res.status(CREATED).json({ message: "member added successfully", success: true, member: newMember });
});

//edit a doc from member doc by id
const editMemberByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });

  const updates = editMemberSchema.parse(req.body);

  const updatedMember = await MemberModel.findByIdAndUpdate(ID, updates);

  res.status(OK).json({ message: "member updated successfully", success: true, member: updatedMember });
});

//delete a doc from member doc by id
const deleteMemberByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });

  await MemberModel.findByIdAndDelete(ID);

  res.status(OK).json({ message: "member deletd successfully", success: true });
});

export { getAllMembers, addMember, editMemberByID, deleteMemberByID };
