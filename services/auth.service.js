import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (userData) => {
  const { username, email, password } = userData;

  const checkEmail = await prisma.user.findUnique({ where: { email } });
  if (checkEmail) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const checkUsername = await prisma.user.findUnique({ where: { username } });
  if (checkUsername) {
    const error = new Error("Username already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
};

export const login = async (credentials) => {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const jwtsecret = process.env.JWTSECRET;
  const token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: "1h" });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token,
  };
};
