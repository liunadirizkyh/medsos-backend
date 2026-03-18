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
      await prisma.likes.delete({
        where: {
          userId_postId: {
            userId: currentUser,
            postId: id,
          },
        },
      });

      await prisma.post.update({
        where: {
          id,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return res.status(200).json({ message: "Post unliked successfully" });
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

export const checkLike = async (req, res) => {
  const id = Number(req.params.id);
  const currentUser = req.user.id;

  try {
    const feed = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!feed) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = await prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: currentUser,
          postId: id,
        },
      },
    });

    if (like) {
      return res.status(200).json({ data: true });
    } else {
      return res.status(200).json({ data: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
