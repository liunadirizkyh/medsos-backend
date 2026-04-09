import * as userService from "../services/user.service.js";

export const getUserbyUsername = async (req, res) => {
  try {
    const user = await userService.getByUsername(req.params.username);
    res.status(200).json({ message: "User retrieved successfully", data: user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const getSearchUser = async (req, res) => {
  try {
    const users = await userService.searchUsers(req.query.username);
    res.status(200).json({ message: "User retrieved successfully", data: users });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const updatedUser = await userService.updateAvatar(req.user.id, req.file);
    res.status(200).json({ message: "Avatar updated successfully", data: updatedUser });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
