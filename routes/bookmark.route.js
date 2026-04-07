import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  checkSaveFeed,
  toogleSaveFeed,
} from "../controller/bookmark.controller.js";

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
 *         description: Berhasil simpan/hapus bookmark
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: Postingan tidak ditemukan
 */
bookmarkRouter.post("/:postId", authMiddleware, toogleSaveFeed);

/**
 * @swagger
 * /api/bookmark/{postId}:
 *   get:
 *     summary: Cek status apakah user sudah menyimpan postingan tertentu
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
 *         description: Status bookmark berhasil dicek
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: boolean
 */
bookmarkRouter.get("/:postId", authMiddleware, checkSaveFeed);

export default bookmarkRouter;
