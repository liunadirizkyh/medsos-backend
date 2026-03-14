import { Router } from "express";
import { followUserAccount } from "../controller/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = Router();

followRouter.post("/", authMiddleware, followUserAccount);

export default followRouter;
