import { prisma } from "../lib/prisma.js";
import * as z from "zod";
import cloudinary from "../lib/cloudinary.js";

export const getUserbyUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      omit: {
        password: true,
      },
      include: {
        posts: {
          omit: {
            userId: true,
            imageId: true,
          },
        },
        bookmark: {
          include: {
            post: {
              omit: {
                userId: true,
                imageId: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User retrieved successfully", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSearchUser = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(404).json({ error: "Username query is required" });
  }

  try {
    const user = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        fullname: true,
        image: true,
      },
    });

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User retrieved successfully", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userSchema = z.object({
      username: z
        .string()
        .min(5, "Username must be at least 5 characters long"),
      fullname: z
        .string()
        .min(2, "Fullname must be at least 2 characters long"),
      bio: z.string().max(200, "Bio must be at most 200 characters long"),
    });

    const validate = userSchema.parse(req.body);

    const currentUser = await prisma.user.findUnique({
      where: {
        username: validate.username,
      },
    });

    if (currentUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const updateUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        username: validate.username,
        fullname: validate.fullname,
        bio: validate.bio,
      },
      omit: {
        password: true,
      },
    });

    res
      .status(201)
      .json({ message: "User updated successfully", user: updateUser });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (currentUser.imageId) {
      await cloudinary.uploader.destroy(currentUser.imageId);
    }

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "avatar",
      transformation: [
        {
          width: 300,
          height: 300,
        },
      ],
    });

    const updateUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        image: result.secure_url,
        imageId: result.public_id,
      },
      omit: {
        password: true,
      },
    });
    res
      .status(201)
      .json({ message: "Avatar updated successfully", user: updateUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
