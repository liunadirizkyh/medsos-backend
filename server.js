import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import followRouter from "./routes/follow.route.js";
import feedRouter from "./routes/feed.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import bookmarkRouter from "./routes/bookmark.route.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();
const port = 3000;

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL })
);


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/feed", feedRouter);
app.use("/api/comment", commentRouter);
app.use("/api/like", likeRouter);
app.use("/api/bookmark", bookmarkRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

export default app;
