import { prisma } from "../lib/prisma.js";

export const createComment = async (req, res) => {
  try {
    const currentUser = req.user.id;
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "Post ID and content are required" });
    }

    const selectPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!selectPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: currentUser,
        postId: Number(postId),
      },
    });

    await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
