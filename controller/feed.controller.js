import * as feedService from "../services/feed.service.js";

export const createFeed = async (req, res) => {
  try {
    const newFeed = await feedService.createFeed(req.user.id, req.body, req.file);
    res.status(201).json({ message: "Feed created successfully", data: newFeed });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const readAllFeeds = async (req, res) => {
  try {
    const result = await feedService.getAllFeeds(req.user.id, req.query);
    res.status(200).json({ message: "Feeds retrieved successfully", data: result });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const detailFeed = async (req, res) => {
  try {
    const post = await feedService.getFeedDetail(req.params.id);
    res.status(200).json({ message: "Feed retrieved successfully", data: post });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteFeed = async (req, res) => {
  try {
    await feedService.deleteFeed(req.user.id, req.params.id);
    res.status(200).json({ message: "Feed deleted successfully" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || "Internal Server Error" });
  }
};
