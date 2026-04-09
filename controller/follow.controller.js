import * as followService from "../services/follow.service.js";

export const followUserAccount = async (req, res) => {
  try {
    const follow = await followService.followUser(
      req.user.id,
      req.body.followUserId
    );
    res.status(201).json({ message: "User followed successfully", data: follow });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const unfollowUserAccount = async (req, res) => {
  try {
    const unfollow = await followService.unfollowUser(
      req.user.id,
      Number(req.params.unfollowUserId)
    );
    res.status(201).json({ message: "User unfollowed successfully", data: unfollow });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const getLimitUser = async (req, res) => {
  try {
    const users = await followService.getSuggestions(req.user.id);
    res.status(200).json({ message: "User suggestions retrieved successfully", data: users });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const checkFollow = async (req, res) => {
  try {
    const isFollowing = await followService.checkFollowStatus(
      req.user.id,
      Number(req.params.followUserId)
    );
    res.status(200).json({ message: "Follow status checked successfully", data: isFollowing });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
