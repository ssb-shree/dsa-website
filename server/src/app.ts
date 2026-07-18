import express, { type Request, type Response } from "express";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.STATUS! === "DEV" ? "http://localhost:3000" : process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(
  morgan(
    "\x1b[36m:date[web]\x1b[0m \x1b[33m:method\x1b[0m (\x1b[34m:url\x1b[0m) Status[\x1b[32m:status\x1b[0m] - [\x1b[35m:response-time ms\x1b[0m]",
  ),
);

import { errorHandler } from "./middlewares/errorHandler.ts";

import AuthRouter from "./routes/auth.routes.ts";
import OrganizationRouter from "./routes/organization.routes.ts";
import EventsRouter from "./routes/event.routes.ts";
import FeedbackRouter from "./routes/feedback.routes.ts";

app.get("/", (req: Request, res: Response) => {
  res.send("server is up!!");
});

import { Event } from "./models/events.model.ts";
import { User } from "./models/user.model.ts";
import asyncHandler from "./utils/asyncHandler.ts";

app.get(
  "/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();

    res.status(200).json({ eventCount, userCount, message: "stats fetched successfully" });
  }),
);

app.use("/auth", AuthRouter);
app.use("/organizations", OrganizationRouter);
app.use("/events", EventsRouter);
app.use("/feedbacks", FeedbackRouter);

app.use(errorHandler);

export default app;
