import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import followRouter from "./routes/follow.route.js";
import feedRouter from "./routes/feed.route.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/feed", feedRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
