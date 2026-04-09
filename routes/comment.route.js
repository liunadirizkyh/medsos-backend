import { Router } from "express";
import {
  createComment,
  deleteComment,
} from "../controller/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

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
 *     summary: Membuat komentar baru di sebuah postingan
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
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment created successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Postingan tidak ditemukan (Bisa jadi sudah dihapus)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found
 *       500:
 *         description: Internal Server Error
 */
commentRouter.post("/", authMiddleware, createComment);

/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     summary: Menghapus komentar sendiri
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID komentar yang akan dihapus
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
 *                   example: Comment deleted successfully
 *       403:
 *         description: Menghapus komentar orang lain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not the owner of this comment
 *       404:
 *         description: Komentar tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Comment not found
 */
commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
