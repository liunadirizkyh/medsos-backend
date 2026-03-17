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

export const deleteComment = async (req, res) => {
  try {
    const currentUser = req.user.id;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== currentUser) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this comment" });
    }

    await prisma.comment.delete({
      where: {
        id: Number(commentId),
      },
    });

    await prisma.post.update({
      where: {
        id: Number(comment.postId),
      },
      data: {
        commentCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
