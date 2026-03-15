import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createFeed,
  readAllFeeds,
  detailFeed,
} from "../controller/feed.controller.js";

const feedRouter = Router();

feedRouter.post("/", authMiddleware, upload.single("image"), createFeed);
feedRouter.get("/", authMiddleware, readAllFeeds);
feedRouter.get("/:id", authMiddleware, detailFeed);

export default feedRouter;
