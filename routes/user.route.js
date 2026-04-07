import { Router } from "express";
import {
  getSearchUser,
  getUserbyUsername,
  updateAvatar,
  updateUser,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manajemen Profil dan Pencarian User
 */

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Mencari user berdasarkan query username
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username yang dicari (partial match didukung)
 *     responses:
 *       200:
 *         description: Daftar user ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       fullname:
 *                         type: string
 *                       image:
 *                         type: string
 *       404:
 *         description: Username query is required / User not found
 */
userRouter.get("/search", getSearchUser);

/**
 * @swagger
 * /api/user/{username}:
 *   get:
 *     summary: Mendapatkan profil user berdasarkan username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data profil user
 *       404:
 *         description: User tidak ditemukan
 */
userRouter.get("/:username", getUserbyUsername);

/**
 * @swagger
 * /api/user/update-user:
 *   put:
 *     summary: Update data profil user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullname
 *               - bio
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 5
 *               fullname:
 *                 type: string
 *                 minLength: 2
 *               bio:
 *                 type: string
 *                 maxLength: 200
 *     responses:
 *       201:
 *         description: Profil berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Validasi error (Zod) atau Username sudah ada
 */
userRouter.put("/update-user", authMiddleware, updateUser);

/**
 * @swagger
 * /api/user/update-photo-profile:
 *   put:
 *     summary: Update foto profil user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Foto profil berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Tidak ada file yang diunggah
 *       500:
 *         description: Gagal upload ke Cloudinary atau internal error
 */
userRouter.put(
  "/update-photo-profile",
  authMiddleware,
  upload.single("image"),
  updateAvatar,
);

export default userRouter;
