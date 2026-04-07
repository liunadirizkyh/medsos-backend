import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createComment,
  deleteComment,
} from "../controller/comment.controller.js";

const commentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Manajemen Komentar pada Postingan
 */

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Menambahkan komentar pada postingan
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Komentar berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Post ID dan konten tidak disertakan
 *       404:
 *         description: Postingan tidak ditemukan
 */
commentRouter.post("/", authMiddleware, createComment);

/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     summary: Menghapus komentar
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Komentar berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Tidak diizinkan (bukan pemilik komentar)
 *       404:
 *         description: Komentar tidak ditemukan
 */
commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
