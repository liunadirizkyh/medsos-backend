import { prisma } from "../lib/prisma.js";

export const toggleBookmark = async (userId, postId) => {
  const postData = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postData) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const checkUserBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (checkUserBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return { bookmarked: false, data: checkUserBookmark };
  }

  const newBookmark = await prisma.bookmark.create({
    data: {
      userId,
      postId,
    },
  });

  return { bookmarked: true, data: newBookmark };
};

export const checkBookmarkStatus = async (userId, postId) => {
  const checkSave = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  return !!checkSave;
};
