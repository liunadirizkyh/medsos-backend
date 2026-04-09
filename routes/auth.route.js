import { Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi dan Manajemen Sesi User
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi User Baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 5
 *                 description: Minimal 5 karakter
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Minimal 8 karakter
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Input tidak valid (Zod validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *       409:
 *         description: Email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/register", validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 *       400:
 *         description: Email atau password tidak disertakan
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan data user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       401:
 *         description: Tidak terautentikasi (Token tidak ada atau tidak valid)
 */
authRouter.get("/me", authMiddleware, getUser);

export default authRouter;
