import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const authMiddleware = async (req, res, next) => {
  const JWTSECRET = process.env.JWTSECRET;

  try {
    const headers = req.headers.authorization;

    if (!headers) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const token = headers.split(" ")[1];
    const decoded = jwt.verify(token, JWTSECRET);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = {
      id: currentUser.id,
      username: currentUser.username,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
