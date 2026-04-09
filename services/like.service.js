import { prisma } from "../lib/prisma.js";

export const toggleLike = async (userId, postId) => {
  const feed = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!feed) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const alreadyLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (alreadyLike) {
    await prisma.$transaction([
      prisma.likes.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return { liked: false };
  }

  await prisma.$transaction([
    prisma.likes.create({
      data: {
        userId,
        postId,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
  return { liked: true };
};

export const checkLikeStatus = async (userId, postId) => {
  const feed = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!feed) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const like = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  return !!like;
};
