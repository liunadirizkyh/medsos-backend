import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const createFeed = async (req, res) => {
  try {
    const { caption } = req.body;
    const currentUserId = req.user.id;

    if (!caption) {
      res.status(400).json({ message: "Caption is required" });
    }

    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "feeds",
      transformation: [
        {
          aspect_ratio: "4:5",
          crop: "fill",
          gravity: "auto",
        },
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });

    const newFeed = await prisma.post.create({
      data: {
        caption: caption,
        image: result.secure_url,
        imageId: result.public_id,
        userId: currentUserId,
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUserId),
      },
      data: {
        postCount: {
          increment: 1,
        },
      },
    });

    res
      .status(201)
      .json({ message: "Feed created successfully", feed: newFeed });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const readAllFeeds = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const followings = await prisma.follow.findMany({
      where: {
        followingId: currentUserId,
      },
      select: {
        followerId: true,
      },
    });
    const followingsIds = followings.map((following) => following.followerId);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const totalFeed = await prisma.post.count({
      where: {
        userId: {
          in: [...followingsIds, currentUserId],
        },
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: [...followingsIds, currentUserId],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    const totalPage = Math.ceil(totalFeed / limit);

    res.status(200).json({
      page,
      limit,
      totalPage,
      totalFeed,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const detailFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            username: true,
            image: true,
          },
        },
        comments: {
          select: {
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullname: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res
      .status(200)
      .json({ message: "Feed retrieved successfully", post: post });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Feed not found" });
    }

    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this feed" });
    }

    await cloudinary.uploader.destroy(post.imageId);

    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: "Feed deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
