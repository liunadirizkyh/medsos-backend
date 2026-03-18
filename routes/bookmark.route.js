import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  checkSaveFeed,
  toogleSaveFeed,
} from "../controller/bookmark.controller.js";

const bookmarkRouter = Router();

bookmarkRouter.post("/:postId", authMiddleware, toogleSaveFeed);
bookmarkRouter.get("/:postId", authMiddleware, checkSaveFeed);

export default bookmarkRouter;
