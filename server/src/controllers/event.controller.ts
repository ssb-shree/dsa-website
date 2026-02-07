import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

import { EventModel } from "../models/event.model";
import { editEventSchema, eventSchema } from "./event.schema";
import { BAD_REQUEST, CREATED, OK } from "../constants/status-codes";

// get all events
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await EventModel.find();
  res.status(OK).json({ message: "fetched events successfully", success: true, events });
});

// add an event
const addEvent = asyncHandler(async (req, res) => {
  const eventData = eventSchema.parse(req.body);
  const newEvent = await EventModel.create(eventData);
  if (!newEvent) res.status(BAD_REQUEST).json({ message: "failed to add event", success: false });
  res.status(CREATED).json({ message: "event added successfully", success: true, event: newEvent });
});

// edit an event by id
const editEventByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  const updates = editEventSchema.parse(req.body);
  const updatedEvent = await EventModel.findByIdAndUpdate(ID, updates);
  res.status(OK).json({ message: "event updated successfully", success: true, event: updatedEvent });
});

// delete an event by id
const deleteEventByID = asyncHandler(async (req, res) => {
  const { ID } = req.params;
  if (!ID) res.status(BAD_REQUEST).json({ message: "id not found", success: false });
  await EventModel.findByIdAndDelete(ID);
  res.status(OK).json({ message: "event deleted successfully", success: true });
});

export { getAllEvents, addEvent, editEventByID, deleteEventByID };
