import { prisma } from "../lib/prisma.js";

export const createComment = async (userId, postId, content) => {
  const selectPost = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });

  if (!selectPost) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        userId,
        postId: Number(postId),
      },
    }),
    prisma.post.update({
      where: { id: Number(postId) },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  return newComment;
};

export const deleteComment = async (userId, commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) },
  });

  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (comment.userId !== userId) {
    const error = new Error("You are not the owner of this comment");
    error.statusCode = 403;
    throw error;
  }

  await prisma.$transaction([
    prisma.comment.delete({ where: { id: Number(commentId) } }),
    prisma.post.update({
      where: { id: Number(comment.postId) },
      data: { commentCount: { decrement: 1 } },
    }),
  ]);
};
