import type { Request, Response } from "express";

import { Organization } from "../models/organization.model";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { addMemberSchema, createOrganizationSchema, updateOrganizationSchema } from "./organization.schema";
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/status-codes";
import { User } from "../models/user.model";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const createOrganizationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // let zod validate the data
  const { name, slug, description, logoUrl, socials, members } = createOrganizationSchema.parse(req.body);

  // get the authenticated user data
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if authenticated users has the Admin role
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
  if (user.role !== "ADMIN")
    throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not allowed to perfom this action");

  // check if same slug, name already doesnt exist
  const organizationExist = await Organization.findOne({
    $or: [{ slug }, { name }],
  });

  if (organizationExist) throw new ApiError(CONFLICT, "Organization with this name or slug already exist");

  // create a entry in DB
  const newOrganization = await Organization.create({
    name,
    slug: slug.toLocaleLowerCase().trim(),
    description,
    logoUrl,
    socials,
    members: [members[0]],
  });

  // update the members Document with the organization ID
  await User.findByIdAndUpdate(members[0], {
    $addToSet: { organizationID: newOrganization._id },
    $set: { role: "ORGANIZOR" },
  });

  // send response
  res.status(CREATED).json({ newOrganization, message: "organization created successfully", success: true });
});

const updateOrganizationController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // let zod validate
  const { slug, name, socials, images, description, logoUrl } = updateOrganizationSchema.parse(req.body);

  // get the authenticated user data
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if authenticated users has the Orgaizor role
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
  if (user.role === "USER")
    throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not allowed to perfom this action");

  // check if such organization exist or not using slug
  const organizationToUpdate = await Organization.findOne({ slug });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if user is part of the organization
  const userAuthorised = organizationToUpdate.members.includes(user._id);
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied");

  // update the data
  const updatedOrganization = await Organization.findOneAndUpdate(
    { slug },
    { name, socials, images, description, logoUrl },
    { new: true },
  );

  // send the response
  res.status(OK).json({ updatedOrganization, message: "updated information successfully", success: false });
});

const addUserToOrganization = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate data by zod
  const { slug, moodleID } = addMemberSchema.parse(req.body);

  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if such organization exist or not
  const organizationToUpdate = await Organization.findOne({ slug });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if authenticated user is in the organization
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied, you arent authorised to perform this action");

  // find the user to be added, using the provided moodleID
  const toAddUser = await User.findOne({ moodleID });
  if (!toAddUser) throw new ApiError(NOT_FOUND, "user not found with this moodleID");

  // check if the moodleID is already a member
  if (organizationToUpdate.members.includes(toAddUser._id))
    throw new ApiError(CONFLICT, "moodleID is already added as memeber");

  // update the organization's members array
  await Organization.findByIdAndUpdate(organizationToUpdate._id, {
    $addToSet: { members: toAddUser._id },
  });

  //update the users organization array
  const addedUser = await User.findOneAndUpdate(
    { moodleID },
    {
      $addToSet: { organizationID: organizationToUpdate._id },
      $set: { role: "ORGANIZOR" },
    },
  ).select("name moodleID division year department");
  //send response
  res.status(OK).json({ message: "member added successfully", success: true, user: addedUser });
});

const removeUserToOrganization = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate data by zod
  const { slug, moodleID } = addMemberSchema.parse(req.body);

  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if such organization exist or not
  const organizationToUpdate = await Organization.findOne({ slug });
  if (!organizationToUpdate) throw new ApiError(NOT_FOUND, "invalid slug provided, to find organization");

  // check if authenticated user is in the organization
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  const userAuthorised = organizationToUpdate.members.includes(user._id) || user.role === "ADMIN";
  if (!userAuthorised) throw new ApiError(UNAUTHORIZED, "access denied,  you arent authorised to perform this action");

  // find the user to be removed, using the provided moodleID
  const toRemoveUser = await User.findOne({ moodleID });
  if (!toRemoveUser) throw new ApiError(NOT_FOUND, "user not found with this moodleID");

  // check if the moodleID is already a member
  if (!organizationToUpdate.members.includes(toRemoveUser._id))
    throw new ApiError(CONFLICT, "moodleID is already not a memeber");

  // check if this removal will make the members list empty
  if (organizationToUpdate.members.length == 1) throw new ApiError(BAD_REQUEST, "cant empty the members list");

  // update the organization's members array
  await Organization.findByIdAndUpdate(organizationToUpdate._id, {
    $pull: { members: toRemoveUser._id },
  });

  //update the users organization array
  const removedUser = await User.findOneAndUpdate(
    { moodleID },
    {
      $pull: { organizationID: organizationToUpdate._id },
    },
    { new: true },
  ).select("name moodleID division year department organizationID");

  // if user organization array is of length 0 then make role user
  if (!removedUser) {
    throw new ApiError(NOT_FOUND, "User not found");
  }

  if (removedUser.organizationID.length === 0) {
    removedUser.role = "USER";
    await removedUser.save();
  }

  //send response
  res.status(OK).json({ message: "member removed successfully", success: true, user: removedUser });
});

// get all events
const getAllEOrganizations = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.query;

  const limit = type === "all" ? 0 : 4;

  const organizations = await Organization.find()
    .select("name slug logoUrl")
    .sort({ updatedAt: -1 }) // get those who were updated(did some activity) recently
    .limit(limit);

  res.status(OK).json({ organizations, message: "organizations fetched successfully", success: true });
});

// get one organization  by ID
const getOrganizationByID = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw new ApiError(BAD_REQUEST, "organization id not provided");

  const organization = await Organization.findOne({ slug }).populate([
    {
      path: "events",
      select: "title slug date day time banner venue speakers description tags externalLinks organizationID",
      options: { sort: { updatedAt: -1 } },
      populate: {
        path: "organizationID", // populate the organizationID field
        select: "name", // only get the name
      },
    },
    {
      path: "members",
      select: "name year division department moodleID",
    },
  ]);

  if (!organization) throw new ApiError(BAD_REQUEST, "invalid organization id provided, failed to fetch organization");

  res.status(OK).json({ organization, message: "organizations fetched successfully", success: true });
});

export {
  createOrganizationController,
  updateOrganizationController,
  addUserToOrganization,
  removeUserToOrganization,
  getAllEOrganizations,
  getOrganizationByID,
};
