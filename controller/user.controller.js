import { prisma } from "../lib/prisma.js";

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
