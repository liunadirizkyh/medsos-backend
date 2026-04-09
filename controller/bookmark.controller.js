import * as bookmarkService from "../services/bookmark.service.js";

export const toogleSaveFeed = async (req, res) => {
  try {
    const result = await bookmarkService.toggleBookmark(req.user.id, Number(req.params.postId));
    const message = result.bookmarked ? "Post bookmarked" : "Bookmark removed";
    res.status(200).json({ message, data: result.data });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const checkSaveFeed = async (req, res) => {
  try {
    const isBookmarked = await bookmarkService.checkBookmarkStatus(req.user.id, Number(req.params.postId));
    const message = isBookmarked ? "Post is bookmarked" : "Post is not bookmarked";
    res.status(200).json({ message, data: isBookmarked });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
