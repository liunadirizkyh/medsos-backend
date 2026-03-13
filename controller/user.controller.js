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
