import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createLike } from "../controller/like.controller.js";

const likeRouter = Router();

likeRouter.post("/:id", authMiddleware, createLike);

export default likeRouter;
