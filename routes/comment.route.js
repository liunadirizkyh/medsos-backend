import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createComment,
  deleteComment,
} from "../controller/comment.controller.js";

const commentRouter = Router();

commentRouter.post("/", authMiddleware, createComment);
commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
