import { Router } from "express";
import {
  getSearchUser,
  getUserbyUsername,
} from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get("/search", getSearchUser);
userRouter.get("/:username", getUserbyUsername);

export default userRouter;
