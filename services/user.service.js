import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const getByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    omit: { password: true },
    include: {
      posts: {
        omit: { userId: true, imageId: true },
      },
      bookmark: {
        include: {
          post: { omit: { userId: true, imageId: true } },
        },
      },
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const searchUsers = async (usernameQuery) => {
  if (!usernameQuery) {
    const error = new Error("Username query is required");
    error.statusCode = 400;
    throw error;
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: usernameQuery,
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

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return users;
};

export const updateProfile = async (userId, profileData) => {
  const { username, fullname, bio } = profileData;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser && existingUser.id !== userId) {
    const error = new Error("Username already exists");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { username, fullname, bio },
    omit: { password: true },
  });
};

export const updateAvatar = async (userId, file) => {
  if (!file) {
    const error = new Error("No file uploaded");
    error.statusCode = 400;
    throw error;
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (currentUser.imageId) {
    await cloudinary.uploader.destroy(currentUser.imageId);
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: "avatar",
    transformation: [{ width: 300, height: 300 }],
  });

  return await prisma.user.update({
    where: { id: userId },
    data: {
      image: result.secure_url,
      imageId: result.public_id,
    },
    omit: { password: true },
  });
};
