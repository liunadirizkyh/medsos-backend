import { Router } from "express";
import { checkLike, createLike } from "../controller/like.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const likeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: Manajemen Suka (Like) pada Postingan
 */

/**
 * @swagger
 * /api/like/{id}:
 *   post:
 *     summary: Menyukai (Like) atau membatalkan (Unlike) postingan
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID postingan yang akan di-like / unlike
 *     responses:
 *       201:
 *         description: Aksi berhasil dijalankan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post liked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 *       404:
 *         description: Postingan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found
 */
likeRouter.post("/:id", authMiddleware, createLike);

/**
 * @swagger
 * /api/like/status/{id}:
 *   get:
 *     summary: Mengecek status Like pada sebuah postingan
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mengembalikan true / false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Like status checked successfully
 *                 data:
 *                   type: boolean
 *                   example: true
 */
likeRouter.get("/status/:id", authMiddleware, checkLike);

export default likeRouter;
