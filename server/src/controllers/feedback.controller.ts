import type { Request, Response } from "express";

import { FeedBack } from "../models/feedback.model";
import { Event } from "../models/events.model";
import { User, type UserDocument } from "../models/user.model";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/status-codes";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

import { feedbackQuestions } from "../utils/questions";
import { feedbackSchema } from "./feedback.schema";
import type { ObjectId } from "mongoose";
import logger from "../utils/logger";

import { Parser } from "json2csv";

const uploadFeedback = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const feedBackData = feedbackSchema.parse(req.body);

  // get the authenticated user data
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check for invalid eventID
  const eventExist = await Event.findOne({ _id: feedBackData.eventID, canFeedback: true });
  if (!eventExist) throw new ApiError(NOT_FOUND, "feedback is not available");

  // get the user data
  const user = await User.findById(userID);
  if (!user) throw new ApiError(FORBIDDEN, "invalid use id provided");

  // check if the user is marked present
  const isPresent = eventExist.attendedStudentsID.has(user.moodleID);
  if (!isPresent) throw new ApiError(UNAUTHORIZED, "mark your attendance to fill the feedback");

  // check if a feedback is already made
  const feedBackAlreadyExist = await FeedBack.findOne({ eventID: eventExist._id, userID });
  if (feedBackAlreadyExist) throw new ApiError(FORBIDDEN, "Can't submit feedback twice");

  // upload a feedback
  await FeedBack.create({ ...feedBackData, userID });

  // send a response
  res.status(CREATED).json({ message: "feedback submitted successfully", success: true });
});

const getFeedbackCsv = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the autheticated users payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  // get the eventID
  const { eventID } = req.params;
  if (!eventID) throw new ApiError(BAD_REQUEST, "event id not provided");

  // get the users data
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid payload, failed to fetch user");

  // check is the user role is organizor
  if (user.role === "USER") throw new ApiError(UNAUTHORIZED, "cant perform this action");

  // check if user is in the  organization who hosted the event
  const eventData = await Event.findById(eventID);
  if (!eventData) throw new ApiError(404, "event not found");

  const isAuthorizedToGetDetails = user.organizationID.some(
    (orgId: ObjectId) => orgId.toString() === eventData.organizationID.toString(),
  );

  if (!isAuthorizedToGetDetails) {
    throw new ApiError(403, "you are not allowed to request this event detail");
  }

  // get all the feedback doc with the eventID and populate the user
  const allFeedbacks = await FeedBack.find({ eventID }).populate<{ userID: UserDocument }>("userID");

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Asia/Kolkata",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  // turn json to csv
  const formattedData = allFeedbacks.map((fb) => ({
    moodleID: fb.userID?.moodleID,
    name: fb.userID?.name,
    year: fb.userID?.year,
    division: fb.userID?.division,
    department: fb.userID?.department,
    [feedbackQuestions.satisfaction]: fb.satisfaction,
    [feedbackQuestions.attendAgain]: fb.attendAgain,
    [feedbackQuestions.instructorFeedback]: fb.instructorFeedback,
    [feedbackQuestions.nextTopics]: fb.nextTopics,
    [feedbackQuestions.suggestions]: fb.suggestions,
    date: fb.createdAt.toLocaleDateString("en-IN", optionsDate),
    time: fb.createdAt.toLocaleTimeString("en-IN", optionsTime),
  }));

  const questions = feedbackQuestions;

  const fields = Object.keys(formattedData[0] || {});
  const parser = new Parser({ fields });

  const csv = parser.parse(formattedData);

  // send the response
  res.header("Content-Type", "text/csv");
  res.attachment("feedback.csv");
  res.send(csv);
});

export { uploadFeedback, getFeedbackCsv };
