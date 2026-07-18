import type { Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import { findSchema, loginSchema, registerSchema, updateSchema } from "./auth.schema";
import ApiError from "../utils/apiError";

import jwt from "jsonwebtoken";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/status-codes";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  // let zod validate the payload
  const { moodleID, name, email, password, department, division, year } = registerSchema.parse(req.body);

  // check if the user alreadu exists
  const isMoodleTaken = await User.findOne({ moodleID });
  const isEmailTaken = await User.findOne({ email });

  if (isMoodleTaken) throw new ApiError(409, "moodleID is already in use");
  if (isEmailTaken) throw new ApiError(409, "email is already in use");

  // create the user
  const user = await User.create({ moodleID, name, email, password, department, division, year });

  // create a token
  const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET!, { expiresIn: "24hr" });

  // set token
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // final response
  res.status(OK).json({ message: "user created successfully", user, success: true, token });
});

const loginController = asyncHandler(async (req: Request, res: Response) => {
  // let zod validate the payload
  const { moodleID, password } = loginSchema.parse(req.body);

  // check if such user exist
  const userExist = await User.findOne({ moodleID })
    .populate({
      path: "organizationID",
      select: "_id name slug logoUrl",
    })
    .populate({
      path: "registeredEvents",
      select: "_id title",
    });

  if (!userExist) throw new ApiError(CONFLICT, "Invalid username or password");

  // commpare the password
  const validPassword = await userExist.comparePassword(password);

  if (!validPassword) throw new ApiError(CONFLICT, "Invalid username or password");

  // create a token
  const token = jwt.sign({ userID: userExist._id }, process.env.JWT_SECRET!, { expiresIn: "24hr" });

  // set token
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(OK).json({ message: "user logged in", userExist, success: true, token });
});

const getUserAuthenticated = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the authenticated user payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if user is has the organizor role
  const user = await User.findById(userID)
    .populate({
      path: "organizationID",
      select: "_id name slug logoUrl",
    })
    .populate({
      path: "registeredEvents",
      select: "_id title slug",
    });

  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  res.status(OK).json({ user, message: "user authenticated successfully", success: true });
});

const findUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");

  // validate the moodleID
  const { moodleID } = findSchema.parse(req.params);

  // get the userID from req.user
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // fetch the user
  const adminUser = await User.findById(userID);
  if (!adminUser) throw new ApiError(BAD_REQUEST, "invalid usedID provided");

  // check if user is Admin
  const isAdmin = adminUser.role === "ADMIN";
  if (!isAdmin) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");

  // fetch the requested user using moodleID
  const user = await User.findOne({ moodleID });
  if (!user) throw new ApiError(NOT_FOUND, "user does not exist with this moodleID");

  // response with the user doc
  res.status(OK).json({ message: "user fetched successfully", success: true, user });
});

const updateUserInfo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");

  // validate the payload
  const data = updateSchema.parse(req.body);

  // get the userID from req.user
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // fetch the user
  const currentUser = await User.findById(userID);
  if (!currentUser) throw new ApiError(BAD_REQUEST, "invalid usedID provided");

  // if current user is trying to update himself then allow else check admin
  const isUpdatingOwnDoc = currentUser.moodleID === data.moodleID;

  // check if user is Admin then allow anyway
  const isAdmin = currentUser.role === "ADMIN";
  if (!isAdmin && !isUpdatingOwnDoc) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");

  // update the user
  const newUser = await User.findOneAndUpdate({ moodleID: data.moodleID }, data);

  // response
  res.status(OK).json({ message: "updated user data", success: true, user: newUser });
});

export { registerController, loginController, getUserAuthenticated, findUser, updateUserInfo };
