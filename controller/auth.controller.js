import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const userSchema = z.object({
      username: z.string().min(5),
      password: z.string().min(8),
      email: z.email(),
    });

    const data = userSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = (req, res) => {
  res.json({
    message: "User logged in successfully",
  });
};
