import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const createFeed = async (userId, feedData, file) => {
  const { caption } = feedData;

  if (!file) {
    const error = new Error("Image is required");
    error.statusCode = 400;
    throw error;
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: "feeds",
    transformation: [
      { aspect_ratio: "4:5", crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });

  const [newFeed] = await prisma.$transaction([
    prisma.post.create({
      data: {
        caption,
        image: result.secure_url,
        imageId: result.public_id,
        userId,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { postCount: { increment: 1 } },
    }),
  ]);

  return newFeed;
};

export const getAllFeeds = async (userId, query) => {
  const followings = await prisma.follow.findMany({
    where: { followingId: userId },
    select: { followerId: true },
  });
  const followingsIds = followings.map((f) => f.followerId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 3;
  const skip = (page - 1) * limit;

  const feedContext = { in: [...followingsIds, userId] };

  const [totalFeed, posts] = await prisma.$transaction([
    prisma.post.count({ where: { userId: feedContext } }),
    prisma.post.findMany({
      where: { userId: feedContext },
      include: {
        user: {
          select: { id: true, fullname: true, username: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    page,
    limit,
    totalPage: Math.ceil(totalFeed / limit),
    totalFeed,
    posts,
  };
};

export const getFeedDetail = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: { id: true, fullname: true, username: true, image: true },
      },
      comments: {
        select: {
          content: true,
          createdAt: true,
          user: {
            select: { id: true, fullname: true, username: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    const error = new Error("Feed not found");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

export const deleteFeed = async (userId, feedId) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(feedId) },
  });

  if (!post) {
    const error = new Error("Feed not found");
    error.statusCode = 404;
    throw error;
  }

  if (post.userId !== userId) {
    const error = new Error("Unauthorized to delete this feed");
    error.statusCode = 403;
    throw error;
  }

  await cloudinary.uploader.destroy(post.imageId);

  return await prisma.$transaction([
    prisma.post.delete({ where: { id: Number(feedId) } }),
    prisma.user.update({
      where: { id: userId },
      data: { postCount: { decrement: 1 } },
    }),
  ]);
};
