import { Router } from "express";
import {
  followUserAccount,
  unfollowUserAccount,
} from "../controller/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = Router();

followRouter.post("/", authMiddleware, followUserAccount);
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);

export default followRouter;
