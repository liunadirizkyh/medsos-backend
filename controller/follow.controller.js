import { prisma } from "../lib/prisma.js";

export const followUserAccount = async (req, res) => {
  const currentUserId = req.user.id;
  const { followUserId } = req.body;

  if (currentUserId === followUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const otherUserId = await prisma.user.findUnique({
    where: {
      id: followUserId,
    },
  });

  const isFollowUser = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: followUserId,
        followingId: currentUserId,
      },
    },
  });

  if (isFollowUser) {
    return res
      .status(400)
      .json({ message: "You are already following this user" });
  }

  if (!otherUserId) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: followUserId,
        followingId: currentUserId,
      },
    });

    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: followUserId,
      },
      data: {
        followerCount: {
          increment: 1,
        },
      },
    });

    res
      .status(201)
      .json({ message: "User followed successfully", data: follow });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
