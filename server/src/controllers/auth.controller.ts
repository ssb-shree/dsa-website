import type { Request, Response } from "express";

import asyncHandler from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "./auth.schema";
import ApiError from "../utils/apiError";

import jwt from "jsonwebtoken";
import { BAD_REQUEST, CONFLICT, OK, UNAUTHORIZED } from "../constants/status-codes";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const loginController = asyncHandler(async (req: Request, res: Response) => {
  // let zod validate the payload
  const { username, password } = loginSchema.parse(req.body);

  const adminUsername = process.env.ADMIN_USERNAME!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  // compare the username
  const validUsername = username === adminUsername;
  // commpare the password
  const validPassword = password === adminPassword;

  if (!validPassword || !validUsername) throw new ApiError(CONFLICT, "Invalid username or password");

  // create a token
  const token = jwt.sign({ userID: adminUsername }, process.env.JWT_SECRET!, { expiresIn: "24hr" });

  // set token
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(OK).json({ message: "user logged in", success: true, token });
});

const getUserAuthenticated = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  res.status(OK).json({ message: "user authenticated successfully", success: true });
});

export { loginController, getUserAuthenticated };
