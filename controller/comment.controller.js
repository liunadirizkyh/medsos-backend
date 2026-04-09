import * as commentService from "../services/comment.service.js";

export const createComment = async (req, res) => {
  try {
    const newComment = await commentService.createComment(
      req.user.id,
      req.body.postId,
      req.body.content
    );
    res.status(201).json({ message: "Comment created successfully", data: newComment });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.user.id, req.params.commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
