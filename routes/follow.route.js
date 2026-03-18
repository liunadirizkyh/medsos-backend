import { Router } from "express";
import {
  checkFollow,
  followUserAccount,
  getLimitUser,
  unfollowUserAccount,
} from "../controller/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = Router();

followRouter.post("/", authMiddleware, followUserAccount);
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);
followRouter.get("/user", authMiddleware, getLimitUser);
followRouter.get("/followUserId", authMiddleware, checkFollow);

export default followRouter;
