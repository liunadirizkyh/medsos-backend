import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkLike, createLike } from "../controller/like.controller.js";

const likeRouter = Router();

likeRouter.post("/:id", authMiddleware, createLike);
likeRouter.get("/:id", authMiddleware, checkLike);

export default likeRouter;
