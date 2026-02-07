import { Router } from "express";

const router = Router();

import {
  getAllEvents,
  addEvent,
  editEventByID,
  deleteEventByID,
} from "../controllers/event.controller";

// get all events
router.get("/", getAllEvents);

// add an event
router.post("/", addEvent);

// edit an event by id
router.put("/:id", editEventByID);

// delete an event by id
router.delete("/:id", deleteEventByID);

export default router;
