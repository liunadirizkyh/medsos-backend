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
 *   description: Manajemen Pertemanan/Follow User
 */

/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Follow user
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
 *         description: Berhasil follow user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Anda sudah follow atau mencoba follow diri sendiri
 *       404:
 *         description: User tidak ditemukan
 */
followRouter.post("/", authMiddleware, followUserAccount);

/**
 * @swagger
 * /api/follow/{unfollowUserId}:
 *   delete:
 *     summary: Unfollow user
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
 *         description: Berhasil unfollow user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
followRouter.delete("/:unfollowUserId", authMiddleware, unfollowUserAccount);

/**
 * @swagger
 * /api/follow/user:
 *   get:
 *     summary: Mendapatkan daftar user untuk disarankan (limit)
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
followRouter.get("/user", authMiddleware, getLimitUser);

/**
 * @swagger
 * /api/follow/{followUserId}:
 *   get:
 *     summary: Cek status apakah sudah mem-follow user tertentu
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
 *         description: Status follow berhasil dicek
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *       404:
 *         description: User tidak ditemukan
 */
followRouter.get("/:followUserId", authMiddleware, checkFollow);

export default followRouter;
