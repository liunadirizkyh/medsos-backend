import { Router } from "express";
import { getUserbyUsername } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get("/:username", getUserbyUsername);

export default userRouter;
