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
          width: 1080,
          height: 1080,
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
