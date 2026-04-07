import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createFeed,
  readAllFeeds,
  detailFeed,
  deleteFeed,
} from "../controller/feed.controller.js";

const feedRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: Manajemen Postingan (Feed)
 */

/**
 * @swagger
 * /api/feed:
 *   post:
 *     summary: Membuat postingan baru
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
 *               - caption
 *               - image
 *             properties:
 *               caption:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Postingan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 feed:
 *                   type: object
 *       400:
 *         description: Caption atau image tidak disertakan
 */
feedRouter.post("/", authMiddleware, upload.single("image"), createFeed);

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: Mendapatkan semua postingan (timeline) beserta pagination
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
 *         description: Jumlah feed per halaman
 *     responses:
 *       200:
 *         description: Daftar postingan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *                 totalFeed:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 */
feedRouter.get("/", authMiddleware, readAllFeeds);

/**
 * @swagger
 * /api/feed/{id}:
 *   get:
 *     summary: Mendapatkan detail postingan (beserta komentar dan user)
 *     tags: [Feed]
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
 *         description: Detail postingan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 post:
 *                   type: object
 *       404:
 *         description: Postingan tidak ditemukan
 */
feedRouter.get("/:id", authMiddleware, detailFeed);

/**
 * @swagger
 * /api/feed/{id}:
 *   delete:
 *     summary: Menghapus postingan
 *     tags: [Feed]
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
 *         description: Postingan berhasil dihapus
 *       403:
 *         description: Tidak diizinkan (bukan pemilik)
 *       404:
 *         description: Postingan tidak ditemukan
 */
feedRouter.delete("/:id", authMiddleware, deleteFeed);

export default feedRouter;
