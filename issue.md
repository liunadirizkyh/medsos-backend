# Issue: Implementasi Dokumentasi API Menggunakan Swagger

## Deskripsi (Objective)
Kita perlu menambahkan dokumentasi API (Application Programming Interface) yang komprehensif, interaktif, dan mudah dibaca pada project backend ini. Dokumentasi ini akan menggunakan standar OpenAPI (sebelumnya dikenal sebagai Swagger). 

Tujuannya agar mempermudah frontend developer, mobile developer, atau pihak ketiga untuk memahami cara menggunakan setiap endpoint API (termasuk Auth, Feed, User, Comment, dan Follow) tanpa perlu membaca *source code* secara langsung. Dokumentasi juga dapat digunakan untuk mencoba (testing) endpoint langsung dari browser.

---

## Prasyarat (Dependencies)
Gunakan library berikut untuk diinstal pada project Express.js:
- `swagger-ui-express`: Menyajikan antarmuka web UI Swagger.
- `swagger-jsdoc`: Membaca anotasi (komentar JSDoc) dalam *source code* dan mengubahnya menjadi spesifikasi OpenAPI berformat JSON.

**Perintah CLI untuk instalasi:**
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

## Tahapan Pengerjaan (Step-by-Step Plan)

Bagi programmer junior atau Asisten AI, silakan ikuti tahapan ini secara berurutan dan persis seperti yang dijelaskan:

### Tahap 1: Membuat File Konfigurasi Swagger
1. Buat direktori baru bernama `config/` di dalam project (jika belum ada).
2. Buat file baru dengan nama `swagger.js` (atau `swagger.config.js`) di dalam folder tersebut.
3. Tambahkan kode berikut untuk inisiasi Swagger JSDoc:

```javascript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Versi standar OpenAPI
    info: {
      title: 'Medsos API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi lengkap untuk API aplikasi media sosial',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Ganti dengan PORT yang sesuai di .env (misalnya 5000)
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Jika project menggunakan JWT untuk autentikasi
        },
      },
    },
  },
  // Tentukan path ke mana swagger harus mencari komentar JSDoc
  // Sesuaikan dengan struktur foldermu. Biasanya route mendefinisikan endpoint.
  apis: ['./routes/*.js', './controller/*.js'], 
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Tahap 2: Menghubungkan Swagger ke Aplikasi Express
1. Buka file utama aplikasi (misalnya `app.js`, `server.js`, atau `index.js`).
2. Import konfigurasi `swaggerSpec` dan library `swagger-ui-express`.
3. Daftarkan *route* untuk dokumentasi.

**Contoh integrasi:**
```javascript
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js'; // Sesuaikan path

const app = express();

// ... middleware lain (cors, express.json, dll)

// Route khusus untuk dokumentasi
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ... route yang lain
```

### Tahap 3: Pembuatan Anotasi (Dokumentasi Endpoint)
Ini adalah tahap iteratif. Anda perlu menambahkan komentar JSDoc berformat OpenAPI tepat di atas definisi rute (`routes/*.js`) atau *controller*. Disarankan meletakkannya di **routes** agar lebih terpusat.

Format dasarnya adalah YAML yang dibungkus dalam komentar `/** ... */`.

**Contoh Template Anotasi untuk API Register diletakkan di `routes/auth.route.js`:**
```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan user baru
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Berhasil melakukan registrasi
 *       400:
 *         description: Input tidak valid atau email sudah digunakan
 *       500:
 *         description: Terjadi kesalahan di server
 */
router.post('/register', authController.register);
```

---

## Daftar Tugas (Checklist Pengerjaan)

Mohon centang checklist ini secara bertahap begitu task selesai.

- [ ] **Setup & Config**
  - [ ] Memastikan `swagger-ui-express` dan `swagger-jsdoc` sudah terinstall.
  - [ ] Membuat file `config/swagger.js`.
  - [ ] Memasang *endpoint* `/api-docs` URL pada file *entry-point* utama (`app.js` / `index.js`).

- [ ] **Anotasi Data / Schema (Opsional namun disarankan)**
  - [ ] Definisikan `components.schemas` di swagger configurasi untuk tipe data (User Schema, Post/Feed Schema, Comment Schema) agar re-usable (tidak perlu mendefinisikan properties object berulang-ulang).

- [ ] **Pembuatan Dokumen Route**
  - [ ] Tambahkan JSDoc di `routes/auth.route.js` (Login, Register, dll). *Berikan penanda Security bearerAuth pada endpoint yang memerlukan token jwt.*
  - [ ] Tambahkan JSDoc di `routes/user.route.js` (Get User Profile, Update Profile, dll).
  - [ ] Tambahkan JSDoc di `routes/feed.route.js` (Create Feed, Get Feed List, Delete, Like, dll).
  - [ ] Tambahkan JSDoc di rute Follow / Unfollow.
  - [ ] Tambahkan JSDoc di rute Comment.

- [ ] **Task Final / Verifikasi**
  - [ ] Jalankan server di `localhost`.
  - [ ] Buka browser dan pergi ke `http://localhost:<PORT>/api-docs`.
  - [ ] Verifikasi semua API sudah muncul sesuai kategori.
  - [ ] *Test/Try It Out* salah satu *endpoint* yang memerlukan JWT Bearer token untuk me-verifikasi autentikasi Swagger berhasil.

---

## Catatan Khusus untuk yang Mengerjakan (Junior/AI)
1. Perhatikan penggunaan Tab/Spasi (`indentation`) di JSDoc (di atas `router`). YAML **sangat sensitif** terhadap indentasi. 2 spasi umumnya paling aman.
2. Pastikan file path `apis` pada `swagger.js` benar-benar mengarah ke file di mana anotasi JSDoc diletakkan.
3. Gunakan tag terpisah seperti `tags: [Auth]`, `tags: [Feed]`, agar tampilan UI Swagger rapi per modul.
