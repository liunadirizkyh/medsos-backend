import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
