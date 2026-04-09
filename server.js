import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import feedRouter from "./routes/feed.route.js";
import commentRouter from "./routes/comment.route.js";
import followRouter from "./routes/follow.route.js";
import likeRouter from "./routes/like.route.js";
import bookmarkRouter from "./routes/bookmark.route.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger Docs Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirect dari root '/' ke '/api-docs' agar langsung masuk ke dokumentasi
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/feed", feedRouter);
app.use("/api/like", likeRouter);
app.use("/api/comment", commentRouter);
app.use("/api/follow", followRouter);
app.use("/api/bookmark", bookmarkRouter);

app.listen(PORT, () => {
  console.log(`Server connect on port: ${PORT}`);
});
