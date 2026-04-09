import * as authService from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const newUser = await authService.register(req.body);
    res.status(201).json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ message: "User logged in successfully", data: result });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User retrieved successfully", data: req.user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
