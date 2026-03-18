import { prisma } from "../lib/prisma.js";

export const createLike = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const currentUser = req.user.id;

    const feed = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!feed) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLike = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUser,
          postId: id,
        },
      },
    });

    if (alreadyLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    await prisma.likes.create({
      data: {
        userId: currentUser,
        postId: id,
      },
    });

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
