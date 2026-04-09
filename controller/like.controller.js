import * as likeService from "../services/like.service.js";

export const createLike = async (req, res) => {
  try {
    const result = await likeService.toggleLike(req.user.id, Number(req.params.id));
    const message = result.liked ? "Post liked successfully" : "Post unliked successfully";
    res.status(result.liked ? 201 : 200).json({ message, data: result });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const checkLike = async (req, res) => {
  try {
    const isLiked = await likeService.checkLikeStatus(req.user.id, Number(req.params.id));
    res.status(200).json({ message: "Like status checked successfully", data: isLiked });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
