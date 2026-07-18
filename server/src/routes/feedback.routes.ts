import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware";
import { uploadFeedback, getFeedbackCsv } from "../controllers/feedback.controller";

const router = Router();

// upload feedback for a event using eventID protected route
router.post("/", checkAuth, uploadFeedback);

// get the feedback csv/excel only for org members of that event
router.get("/:eventID", checkAuth, getFeedbackCsv);

export default router;
