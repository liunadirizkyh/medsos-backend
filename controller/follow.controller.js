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

export const unfollowUserAccount = async (req, res) => {
  const unfollowUserId = Number(req.params.unfollowUserId);
  const currentUserId = req.user.id;

  try {
    const unfollow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: unfollowUserId,
          followingId: currentUserId,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: unfollowUserId,
      },
      data: {
        followerCount: {
          decrement: 1,
        },
      },
    });

    res
      .status(201)
      .json({ message: "User unfollowed successfully", data: unfollow });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLimitUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const followedUser = await prisma.follow.findMany({
      where: {
        followingId: currentUserId,
      },
      select: {
        followerId: true,
      },
    });

    const followedIds = followedUser.map((user) => user.followerId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, currentUserId],
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        image: true,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "User suggestions retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkFollow = async (req, res) => {
  try {
    const currentUser = req.user.id;
    const { followUserId } = req.body;

    const checkFollowUserId = await prisma.user.findUnique({
      where: {
        id: Number(followUserId),
      },
    });

    if (!checkFollowUserId) {
      return res.status(404).json({ message: "User not found" });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followUserId,
          followingId: currentUser,
        },
      },
    });

    if (follow) {
      return res.status(200).json({ data: true });
    } else {
      return res.status(200).json({ data: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
