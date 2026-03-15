import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { createFeed } from "../controller/feed.controller.js";

const feedRouter = Router();

feedRouter.post("/", authMiddleware, upload.single("image"), createFeed);

export default feedRouter;
