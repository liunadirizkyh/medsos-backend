import { Router } from "express";
import {
  createFeed,
  deleteFeed,
  detailFeed,
  readAllFeeds,
} from "../controller/feed.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createFeedSchema } from "../validations/feed.validation.js";

const feedRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: Manajemen Postingan (Feed) User
 */

/**
 * @swagger
 * /api/feed:
 *   post:
 *     summary: Membuat postingan (Feed) baru
 *     tags: [Feed]
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
 *               caption:
 *                 type: string
 *                 description: Teks caption postingan
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Foto yang akan diunggah (wajib)
 *     responses:
 *       201:
 *         description: Feed berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feed created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validasi gagal (misal tidak ada foto disertakan)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Image is required
 *       500:
 *         description: Internal Server Error (Kendala Cloudinary/DB)
 */
feedRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createFeedSchema),
  createFeed
);

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: Mendapatkan semua postingan (Timeline)
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan kumpulan postingan terbaru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feeds retrieved successfully
 *                 data:
 *                   type: object
 */
feedRouter.get("/", authMiddleware, readAllFeeds);

/**
 * @swagger
 * /api/feed/{id}:
 *   get:
 *     summary: Mendapatkan detail satu postingan beserta komentarnya
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari postingan
 *     responses:
 *       200:
 *         description: Data feed berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feed retrieved successfully
 *                 data:
 *                   type: object
 *       404:
 *         description: Postingan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Feed not found
 */
feedRouter.get("/:id", authMiddleware, detailFeed);

/**
 * @swagger
 * /api/feed/{id}:
 *   delete:
 *     summary: Menghapus postingan milik sendiri
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID postingan yang ingin dihapus
 *     responses:
 *       200:
 *         description: Postingan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feed deleted successfully
 *       403:
 *         description: Tidak memiliki otorisasi menghapus (Bukan milik sendiri)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized to delete this feed
 *       404:
 *         description: Postingan tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Feed not found
 */
feedRouter.delete("/:id", authMiddleware, deleteFeed);

export default feedRouter;
