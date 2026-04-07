import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkLike, createLike } from "../controller/like.controller.js";

const likeRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: Manajemen Like pada Postingan
 */

/**
 * @swagger
 * /api/like/{id}:
 *   post:
 *     summary: Like/Unlike postingan
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID postingan (feed)
 *     responses:
 *       200:
 *         description: Berhasil unlike postingan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       201:
 *         description: Berhasil like postingan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Postingan tidak ditemukan
 */
likeRouter.post("/:id", authMiddleware, createLike);

/**
 * @swagger
 * /api/like/{id}:
 *   get:
 *     summary: Cek status apakah user sudah me-like postingan tertentu
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
 *         description: Status like berhasil dicek
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *       404:
 *         description: Postingan tidak ditemukan
 */
likeRouter.get("/:id", authMiddleware, checkLike);

export default likeRouter;
