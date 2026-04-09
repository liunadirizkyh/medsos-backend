import { Router } from "express";
import {
  checkFollow,
  followUserAccount,
  getLimitUser,
  unfollowUserAccount,
} from "../controller/follow.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Manajemen Pertemanan / Mengikuti Akun
 */

/**
 * @swagger
 * /api/follow/suggestions:
 *   get:
 *     summary: Mendapatkan rekomendasi user untuk diikuti (Max 5)
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data saran teman
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User suggestions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
followRouter.get("/suggestions", authMiddleware, getLimitUser);

/**
 * @swagger
 * /api/follow/status/{followUserId}:
 *   get:
 *     summary: Mengecek apakah saat ini sedang mengikuti suatu akun
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followUserId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mengembalikan boolean (true/false)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Follow status checked successfully
 *                 data:
 *                   type: boolean
 *                   example: true
 */
followRouter.get("/status/:followUserId", authMiddleware, checkFollow);

/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Mengikuti seorang user (Follow)
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followUserId
 *             properties:
 *               followUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Berhasil mem-follow user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User followed successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Mem-follow diri sendiri atau sudah mem-follow sebelumnya
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are already following this user
 */
followRouter.post("/", authMiddleware, followUserAccount);

/**
 * @swagger
 * /api/follow/{unfollowUserId}:
 *   delete:
 *     summary: Berhenti mengikuti seorang user (Unfollow)
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unfollowUserId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Berhasil meng-unfollow user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User unfollowed successfully
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal Server Error
 */
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);

export default followRouter;
