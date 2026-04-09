import { Router } from "express";
import {
  getSearchUser,
  getUserbyUsername,
  updateAvatar,
  updateUser,
} from "../controller/user.controller.js";
import upload from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { updateProfileSchema } from "../validations/user.validation.js";

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
 *     summary: Mencari user berdasarkan username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username yang ingin dicari (Case Insensitive)
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Parameter spesifik tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
userRouter.get("/search", authMiddleware, getSearchUser);

/**
 * @swagger
 * /api/user/{username}:
 *   get:
 *     summary: Mendapatkan profil lengkap user berdasarkan username
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username target
 *     responses:
 *       200:
 *         description: Profil user beserta postingan dan bookmark berhasil diambil
 *       404:
 *         description: User tidak ditemukan
 */
userRouter.get("/:username", authMiddleware, getUserbyUsername);

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Mengupdate profil user (username, fullname, bio)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullname:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 *       400:
 *         description: Username conflict atau validasi gagal
 */
userRouter.put("/", authMiddleware, validate(updateProfileSchema), updateUser);

/**
 * @swagger
 * /api/user/avatar:
 *   put:
 *     summary: Mengupdate foto profil user (Avatar)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto yang akan diunggah
 *     responses:
 *       200:
 *         description: Avatar berhasil diupdate
 *       400:
 *         description: Tidak ada file yang diunggah
 */
userRouter.put("/avatar", authMiddleware, upload.single("image"), updateAvatar);

export default userRouter;
