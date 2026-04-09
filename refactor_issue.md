# Rencana Refactoring: Standarisasi "Enterprise Best Practice"
Dokumen ini berisi panduan bertahap (step-by-step) untuk membersihkan dan merapikan arsitektur backend Express.js. Dokumen ini sangat rinci dan didesain agar mudah diikuti oleh Junior Programmer atau AI Assistant.

## Fase 1: Standarisasi Balikan (Response) API
**Tujuan**: Menyeragamkan format JSON yang dikembalikan oleh server baik saat sukses maupun saat error. Semua frontend/mobile developer butuh keseragaman ini.

### Langkah-langkah:
1. **Buat file helper response:**
   - Direktori target: `utils/response.util.js`
   - Buat fungsi `formatSuccess(res, statusCode, message, data = null)` yang me-return `res.status(statusCode).json({ status: 'success', message, data })`.
   - Buat fungsi `formatError(res, statusCode, message, errors = null)` yang me-return `res.status(statusCode).json({ status: 'error', message, errors })`.
2. **Penerapan pada Controller:**
   - Ubah secara bertahap semua `res.status(200).json(...)` yang ada di dalam `controller/*.js` menjadi `return formatSuccess(res, 200, "sukses", data)`.
   - Lakukan pada `auth.controller.js` terlebih dahulu, pastikan tidak ada yang rusak, lalu lanjutkan ke controller lain (user, feed, comment, follow, like, bookmark).

---

## Fase 2: Manajemen Error Terpusat & Penghapusan Try-Catch Berulang
**Tujuan**: Membersihkan kode Controller dari `try { ... } catch (error) { ... }` yang diulang-ulang.

### Langkah-langkah:
1. **Buat file Custom Error Class:**
   - Direktori target: `utils/ApiError.util.js`
   - Buat kelas turunan dari Error bawaan JS: `class ApiError extends Error { constructor(statusCode, message) { super(message); this.statusCode = statusCode; } }`. Ekspor kelas ini.
2. **Buat Wrapper `catchAsync`:**
   - Direktori target: `utils/catchAsync.util.js`
   - Kodenya sederhana: `const catchAsync = (fn) => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch((err) => next(err)); }; export default catchAsync;`
3. **Buat Global Error Middleware:**
   - Direktori target: `middleware/error.middleware.js`
   - Kodenya menerima empat parameter: `(err, req, res, next)`.
   - Di dalamnya, tangkap error, periksa status code-nya, lalu gunakan `formatError()` dari Fase 1 untuk me-return HTTP Response.
4. **Pendaftaran di `server.js`:**
   - Impor middleware error tadi dan panggil `app.use(errorMiddleware)` di **paling bawah** `server.js` (tepat sebelum `app.listen`).
5. **Penerapan (Refactoring) di Controller:**
   - Hapus blok `try...catch` dari semua fungsi controller.
   - Bungkus fungsinya dengan `catchAsync`.
   - Contoh perubahan:
     ```javascript
     // Sebelum:
     export const getUser = async (req, res) => { try { ... } catch(err) { res.status(500)... } }
     // Sesudah:
     export const getUser = catchAsync(async (req, res) => { ... })
     ```

---

## Fase 3: Pemisahan Validasi Data (Validation Middleware)
**Tujuan**: Membersihkan Controller dari validasi skema (Zod) agar Controller fokus hanya pada logika inti.

### Langkah-langkah:
1. **Pindahkan Skema Zod:**
   - Buat folder `validations/`.
   - Pisahkan skema Zod (misal: skema Register dan Login) dari `auth.controller.js` dan pindahkan ke `validations/auth.validation.js`.
2. **Buat Middleware Validasi Universal:**
   - Buat file `middleware/validate.middleware.js`.
   - Buat fungsi yang menerima `schema` Zod sebagai parameter, mengeksekusi `schema.parse(req.body)`, dan jika gagal, melempar pesan via `throw new ApiError(400, errorMessage)` ke Global Error Middleware.
3. **Terapkan pada Routes:**
   - Modifikasi file rute seperti `routes/auth.route.js`.
   - Sisipkan middleware validasi di rutenya. Contoh: 
     `authRouter.post('/register', validate(authValidation.registerSchema), registerUser);`
   - Hapus sisa kode validasi Zod yang tertinggal di dalam fungsi `controller`.

---

## Fase 4: Pemisahan Bisnis Logika ("Service Layer")
**Tujuan**: Mengeluarkan logika rumit (pengecekan password, logika toggle follow) dan interaksi Prisma dari dalam *Controller* dan memindahkannya ke *Service*.

### Langkah-langkah:
1. **Buat folder `services/`**
2. **Refactoring Auth (Sebagai Contoh Pertama):**
   - Buat `services/auth.service.js`.
   - Buat fungsi `register(username, email, password)` di dalam service.
   - Pindahkan logika periksa email (`prisma.user.findUnique`), hashing password bcrypt, dan simpan user baru (`prisma.user.create`) ke dalam fungsi `register` ini.
   - Apabila email sudah terdaftar, `throw new ApiError(409, "Email sudah ada")`.
3. **Panggil Service di Controller:**
   - Kembali ke `controllers/auth.controller.js`.
   - Ubah `registerUser` sehingga barisnya menjadi sangat singkat:
     ```javascript
     export const registerUser = catchAsync(async (req, res) => {
        const newUser = await authService.register(req.body);
        return formatSuccess(res, 201, "Registrasi berhasil", newUser);
     });
     ```
4. **Ulangi Metode Ini untuk Modul Lain:**
   - Pisahkan proses manipulasi data ke `services/user.service.js`, `services/feed.service.js`, `services/like.service.js`, dst.

### Kriteria Penyelesaian Tugas (Definition of Done)
1. Semua fungsi *Controller* tidak lagi mengandung `try...catch` dan kode respon JSON mentah.
2. Semua error di-handle di `error.middleware.js`.
3. Tidak ada lagi fungsi `prisma` (query database) di file `controller/*.js`. Semua pemanggilan database harus tersentralisasi di folder `services/`.
4. Aplikasi bisa *running* dan endpoints API bekerja sama persis seperti sebelumnya tanpa error.
