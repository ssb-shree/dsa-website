import { User } from "../models/user.model";
import { Organization } from "../models/organization.model";
import { Event } from "../models/events.model";

import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { checkFilter } from "../utils/checkFilter";

import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import type { Request, Response } from "express";

import {
  addAttendedStudentSchema,
  getListSchema,
  hostEventSchema,
  registerStudentSchema,
  updateEventSchema,
} from "./event.schema";

import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/status-codes";

import type { ObjectId } from "mongoose";

import { Parser } from "json2csv";
import logger from "../utils/logger";
import { isUserInOrganization } from "../utils/isOrganizor";
import { FeedBack } from "../models/feedback.model";

// get all events
const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  // pagination logic
  const { skip } = req.query;
  const skipNum = Number(skip) || 0;
  const limitNum = 8;

  const events = await Event.find({ isPublic: true })
    .populate({
      path: "organizationID",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .skip(skipNum)
    .limit(limitNum);

  const total = await Event.countDocuments({ isPublic: true });

  const hasMore = skipNum + limitNum < total;

  res.status(OK).json({ events, message: "events fetched successfully", hasMore, success: true });
});

// get one event  by slug
const getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) throw new ApiError(BAD_REQUEST, "event slug not provided");

  const event = await Event.findOne({ slug }).populate({
    path: "organizationID",
    select: "name slug",
  });
  if (!event) throw new ApiError(BAD_REQUEST, "invalid event id provided, failed to fetch event");

  // TODO - hide event for users but show for organizor so make this a private route
  res.status(OK).json({ event, message: "events fetched successfully", success: true });
});

// organizors can host an event
const hostEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  //validate the payload by zod
  const {
    organizationID,

    title,
    banner,
    date,
    venue,
    time,
    description,
    tags,
    externalLinks,
    speakers,

    allowedDepartments,
    allowedDivisions,
    allowedYears,
  } = hostEventSchema.parse(req.body);

  // get the authenticated user payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if user is has the organizor role
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
  if (user.role === "USER")
    throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not allowed to perfom this action");

  // check is user is part of the organization using slug
  const organization = await Organization.findById(organizationID);
  if (!organization) throw new ApiError(NOT_FOUND, "invalid id provided to find the organization");

  if (!organization.members.includes(user._id))
    throw new ApiError(UNAUTHORIZED, "access denies, not a member of organizations");

  const slug = `${title}-by-${organization.slug}`.trim().toLowerCase().replace(/\s+/g, "-");

  // create an event
  const event = await Event.create({
    organizationID: organization._id,
    title,
    banner,
    date,
    venue,
    time,
    description,
    tags,
    externalLinks,
    speakers,
    slug,
    allowedDepartments,
    allowedYears,
    allowedDivisions,
  });

  // add event to organizations events list
  await Organization.findByIdAndUpdate(organization._id, {
    $addToSet: { events: event._id },
  });

  // send a response
  res.status(CREATED).json({ event, message: "event hosted successfully", succee: true });
});

// organizors can update information of a event
const updateEventInformation = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the event id from params
  const { eventID } = req.params;
  if (!eventID) throw new ApiError(BAD_REQUEST, "event id was not provided");

  // validate the body by zod
  const toUpdateData = updateEventSchema.parse(req.body);

  // get the authenticated user payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if user is has the organizor role
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
  if (user.role === "USER")
    throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not allowed to perfom this action");

  // check if user is in the  organization who hosted the event
  const eventData = await Event.findById(eventID);
  if (!eventData) throw new ApiError(404, "event not found");

  const isAuthorizedToGetDetails = isUserInOrganization(user, eventData.organizationID);

  if (!isAuthorizedToGetDetails) {
    throw new ApiError(403, "you are not allowed to request this event detail");
  }

  if (toUpdateData.title) {
    const organization = await Organization.findById(eventData.organizationID);
    if (!organization) throw new ApiError(NOT_FOUND, "organization not found");

    toUpdateData.slug = `${toUpdateData.title}-by-${organization.slug}`.trim().toLowerCase().replace(/\s+/g, "-");
  }

  // update the event
  const event = await Event.findOneAndUpdate({ _id: eventID }, toUpdateData, { new: true });

  // send a response
  res.status(OK).json({ event, message: "event updated successfully", succee: true });
});

// organizors can delete a hosted event
const deleteEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // get the event id from params
  const { eventID } = req.params;
  if (!eventID) throw new ApiError(BAD_REQUEST, "event id was not provided");

  // get the authenticated user payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // check if user is has the organizor role
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");
  if (user.role === "USER")
    throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not allowed to perfom this action");

  // check if such event exist
  const event = await Event.findById(eventID);
  if (!event) throw new ApiError(NOT_FOUND, "event not found");

  // check is user is part of the organization using slug
  const isOrganizer = isUserInOrganization(user, event.organizationID);
  if (!isOrganizer) throw new ApiError(UNAUTHORIZED, "unauthorised action, you are not in this org");

  // delete the event
  await Event.findOneAndDelete({ _id: eventID });

  // delete all the feedback docs
  await FeedBack.deleteMany({ eventID });

  // send a response
  res.status(CREATED).json({ event, message: "event updated successfully", succee: true });
});

//users to register for an hoster event
const registerForEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate the body by zod
  const { eventID, moodleID } = registerStudentSchema.parse(req.body);

  // get the authenticated user payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;
  if (!userID) throw new ApiError(UNAUTHORIZED, "Bad request, userID is missing");

  // get user data
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid token provided, failed to fetch user");

  // check if user passes the filters
  const getFilters = await Event.findById(eventID);

  if (!getFilters) throw new ApiError(NOT_FOUND, "event does not exist");

  const canRegister =
    checkFilter(getFilters.allowedYears, user.year) &&
    checkFilter(getFilters.allowedDepartments, user.department) &&
    checkFilter(getFilters.allowedDivisions, user.division);

  if (!canRegister) throw new ApiError(NOT_FOUND, "not eligible to register");

  // add users moodleID to event document
  const event = await Event.findOneAndUpdate(
    { _id: eventID, canRegister: true },
    {
      $addToSet: {
        registerdStudentsID: moodleID,
      },
    },
    { new: true },
  );

  if (!event) throw new ApiError(INTERNAL_SERVER_ERROR, "registration's are closed by the organization");

  // add event to users registerdEvents list
  await User.updateOne(
    { _id: userID },
    {
      $addToSet: { registeredEvents: eventID },
    },
  );

  // send response
  res.status(OK).json({ message: "registered successfully", success: true });
});

// organizors can add attended student list
const markAttendanceForEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate the body by zod
  const { eventID, moodleID } = addAttendedStudentSchema.parse(req.body);

  // get the autheticated users payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

  // get the users data
  const user = await User.findById(userID);
  if (!user) throw new ApiError(NOT_FOUND, "invalid payload, failed to fetch user");

  // check is the user role is organizor
  if (user.role === "USER") throw new ApiError(UNAUTHORIZED, "cant perform this action");

  // check if user is in the  organization who hosted the event
  const eventData = await Event.findById(eventID);
  if (!eventData) throw new ApiError(404, "event not found");

  const isAuthorizedToUpdateEvent = user.organizationID.some(
    (orgId: ObjectId) => orgId.toString() === eventData.organizationID.toString(),
  );

  if (!isAuthorizedToUpdateEvent) {
    throw new ApiError(403, "you are not allowed to edit this event");
  }

  // update the attended student list
  const event = await Event.findOneAndUpdate(
    {
      _id: eventID,
      registerdStudentsID: moodleID,
    },
    {
      $set: {
        [`attendedStudentsID.${moodleID}`]: new Date(),
      },
    },
    { new: true },
  );

  if (!event) {
    throw new ApiError(403, "Student is not registered for this event");
  }

  const allMoodleIDs = Array.from(event.attendedStudentsID.keys());

  // send response
  res.status(OK).json({ allMoodleIDs, message: "attendance marked successfully", success: true });
});

const markAttendanceForEventBluck = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {});

// organizors can get the list of registerd student
const getRegisteredStudents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate the payload by zod
  const { eventID } = getListSchema.parse(req.params);

  // get the autheticated users payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

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

  // fetch the list and populate it with {sr no, moodleID,name, department, year, division}
  const registrationList = await User.find(
    { registeredEvents: eventID },
    {
      moodleID: 1,
      name: 1,
      department: 1,
      year: 1,
      division: 1,
      _id: 0,
    },
  );

  // format data with serial number for csv
  const formattedData = registrationList.map((user, index) => ({
    sr_no: index + 1,
    moodleID: user.moodleID,
    name: user.name,
    department: user.department,
    year: user.year,
    division: user.division,
  }));

  // parse json into csv using json2csv package
  const parser = new Parser({
    fields: ["sr_no", "moodleID", "name", "department", "year", "division"],
  });

  const csv = parser.parse(formattedData);

  //set headers in response object
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=registration-list.csv");

  // final response
  res.status(OK).end(csv);
});

// organizors can get the list of attended students
const getAttendedStudents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // validate the payload by zod
  const { eventID } = getListSchema.parse(req.params);

  // get the autheticated users payload
  if (!req.user || !req.user.userID) throw new ApiError(UNAUTHORIZED, "unauthorized to perform this action");
  const { userID } = req.user;

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

  // get all the moodle ID's
  const allMoodleIDs = Array.from(eventData.attendedStudentsID.keys());

  // fetch the list and populate it with {sr no, moodleID,name, department, year, division}
  const attendedStudentList = await User.find(
    { moodleID: { $in: allMoodleIDs } },
    {
      moodleID: 1,
      name: 1,
      department: 1,
      year: 1,
      division: 1,
      _id: 0,
    },
  );

  // options to convert iso date into human readable date
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

  // format data with serial number for csv
  const formattedData = attendedStudentList.map((user, index) => ({
    sr_no: index + 1,
    moodleID: user.moodleID,
    name: user.name,
    department: user.department,
    year: user.year,
    division: user.division,
    date: eventData?.attendedStudentsID.get(user.moodleID)?.toLocaleDateString("en-IN", optionsDate) ?? null,
    time: eventData?.attendedStudentsID.get(user.moodleID)?.toLocaleTimeString("en-IN", optionsTime) ?? null,
  }));

  // parse json into csv using json2csv package
  const parser = new Parser({
    fields: ["sr_no", "moodleID", "name", "department", "year", "division", "date", "time"],
  });

  const csv = parser.parse(formattedData);

  //set headers in response object
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=attendance-list.csv");

  // final response
  res.status(OK).end(csv);
});

export {
  hostEvent,
  updateEventInformation,
  registerForEvent,
  markAttendanceForEvent,
  getRegisteredStudents,
  getAttendedStudents,
  getAllEvents,
  getEventBySlug,
  deleteEvent,
};
