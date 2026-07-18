import { Router } from "express";

const router = Router();

import { checkAuth } from "../middlewares/auth.middleware";

import {
  deleteEvent,
  getAllEvents,
  getAttendedStudents,
  getEventBySlug,
  getRegisteredStudents,
  hostEvent,
  markAttendanceForEvent,
  registerForEvent,
  updateEventInformation,
} from "../controllers/event.controller";

// get all events
router.get("/", getAllEvents);

// get one event by ID
router.get("/:slug", getEventBySlug);

// organizors can host an event
router.post("/", checkAuth, hostEvent);

// organizors can update information of a event
router.patch("/:eventID", checkAuth, updateEventInformation);

// organizors can delete a hosted event
router.delete("/:eventID", checkAuth, deleteEvent);

// users to register for an hoster event
router.post("/:eventID/register", checkAuth, registerForEvent);

// organizors can add attended student
router.post("/:eventID/attended", checkAuth, markAttendanceForEvent);

// organizors can get the list of registerd student
router.get("/:eventID/register", checkAuth, getRegisteredStudents);

// organizors can get the list of attended students
router.get("/:eventID/attended", checkAuth, getAttendedStudents);

export default router;
