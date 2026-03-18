import { prisma } from "../lib/prisma.js";

export const toogleSaveFeed = async (req, res) => {
  const currentUser = req.user.id;
  const postId = Number(req.params.postId);

  try {
    const postData = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postData) {
      return res.status(404).json({ message: "Post not found" });
    }

    const checkUserBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: currentUser,
          postId: postId,
        },
      },
    });

    if (checkUserBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: currentUser,
            postId: postId,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "Bookmark removed", data: checkUserBookmark });
    }

    const createBookmark = await prisma.bookmark.create({
      data: {
        userId: currentUser,
        postId: postId,
      },
    });

    return res
      .status(200)
      .json({ message: "Post bookmarked", data: createBookmark });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
