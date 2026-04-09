import { prisma } from "../lib/prisma.js";

export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    const error = new Error("You cannot follow yourself");
    error.statusCode = 400;
    throw error;
  }

  const otherUser = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!otherUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isFollowUser = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: followingId,
        followingId: followerId,
      },
    },
  });

  if (isFollowUser) {
    const error = new Error("You are already following this user");
    error.statusCode = 400;
    throw error;
  }

  const [follow] = await prisma.$transaction([
    prisma.follow.create({
      data: {
        followerId: followingId,
        followingId: followerId,
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { followingCount: { increment: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { followerCount: { increment: 1 } },
    }),
  ]);

  return follow;
};

export const unfollowUser = async (followerId, followingId) => {
  const [unfollow] = await prisma.$transaction([
    prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: followingId,
          followingId: followerId,
        },
      },
    }),
    prisma.user.update({
      where: { id: followerId },
      data: { followingCount: { decrement: 1 } },
    }),
    prisma.user.update({
      where: { id: followingId },
      data: { followerCount: { decrement: 1 } },
    }),
  ]);

  return unfollow;
};

export const getSuggestions = async (userId) => {
  const followedUser = await prisma.follow.findMany({
    where: { followingId: userId },
    select: { followerId: true },
  });

  const followedIds = followedUser.map((user) => user.followerId);

  return await prisma.user.findMany({
    where: {
      id: { notIn: [...followedIds, userId] },
    },
    select: { id: true, username: true, fullname: true, image: true },
    take: 5,
    orderBy: { createdAt: "desc" },
  });
};

export const checkFollowStatus = async (followerId, followingId) => {
  const otherUser = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!otherUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: followingId,
        followingId: followerId,
      },
    },
  });

  return !!follow;
};
