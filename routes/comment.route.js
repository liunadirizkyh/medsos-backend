import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createComment } from "../controller/comment.controller.js";

const commentRouter = Router();

commentRouter.post("/", authMiddleware, createComment);

export default commentRouter;
