import { Router } from "express";
import {
  checkSaveFeed,
  toogleSaveFeed,
} from "../controller/bookmark.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const bookmarkRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Bookmark
 *   description: Manajemen Bookmark/Save Postingan
 */

/**
 * @swagger
 * /api/bookmark/{postId}:
 *   post:
 *     summary: Simpan (Bookmark) atau hapus dari simpanan postingan
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status bookmark berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post bookmarked
 *                 data:
 *                   type: object
 *       404:
 *         description: Post tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found
 */
bookmarkRouter.post("/:postId", authMiddleware, toogleSaveFeed);

/**
 * @swagger
 * /api/bookmark/status/{postId}:
 *   get:
 *     summary: Mengecek status tersimpan (Bookmark) dari postingan
 *     tags: [Bookmark]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mengembalikan true jika disimpan, false jika tidak
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post is bookmarked
 *                 data:
 *                   type: boolean
 *                   example: true
 */
bookmarkRouter.get("/status/:postId", authMiddleware, checkSaveFeed);

export default bookmarkRouter;
