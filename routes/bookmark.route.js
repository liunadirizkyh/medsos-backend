import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { toogleSaveFeed } from "../controller/bookmark.controller.js";

const bookmarkRouter = Router();

bookmarkRouter.post("/:postId", authMiddleware, toogleSaveFeed);

export default bookmarkRouter;
