import * as z from "zod";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const jwtsecret = process.env.JWTSECRET;
    var token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: "1h" });

    res.json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
