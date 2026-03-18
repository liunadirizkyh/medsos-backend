<![CDATA[<div align="center">

# 🚀 Medsos API

**RESTful API untuk platform media sosial — dibangun dengan Express.js & Prisma**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## 📖 Tentang Project

**Medsos API** adalah backend RESTful API untuk aplikasi media sosial. API ini menyediakan fitur-fitur utama seperti autentikasi pengguna, posting konten dengan gambar, sistem follow, komentar, like, dan bookmark — layaknya platform media sosial modern.

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🔐 **Autentikasi** | Register & Login dengan JWT (JSON Web Token) |
| 👤 **User Management** | Profil pengguna, update avatar, pencarian user |
| 📝 **Feed / Posting** | Buat, lihat, dan hapus postingan dengan gambar |
| 👥 **Follow System** | Follow & unfollow pengguna lain |
| 💬 **Komentar** | Tambah dan hapus komentar pada postingan |
| ❤️ **Like** | Like / unlike postingan |
| 🔖 **Bookmark** | Simpan postingan favorit |
| 🖼️ **Upload Gambar** | Upload gambar via Cloudinary |
| ✅ **Validasi** | Input validation menggunakan Zod |

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** JSON Web Token (JWT) & Bcrypt
- **Image Upload:** Cloudinary + Multer
- **Validation:** Zod
- **Deployment:** Vercel

## 📁 Struktur Project

```
backend/
├── controller/              # Business logic
│   ├── auth.controller.js
│   ├── bookmark.controller.js
│   ├── comment.controller.js
│   ├── feed.controller.js
│   ├── follow.controller.js
│   ├── like.controller.js
│   └── user.controller.js
├── routes/                  # API route definitions
│   ├── auth.route.js
│   ├── bookmark.route.js
│   ├── comment.route.js
│   ├── feed.route.js
│   ├── follow.route.js
│   ├── like.route.js
│   └── user.route.js
├── middleware/              # Express middleware
│   ├── auth.middleware.js   # JWT authentication
│   └── upload.middleware.js # Multer file upload
├── lib/                     # Utility & config
│   ├── cloudinary.js        # Cloudinary config
│   └── prisma.js            # Prisma client
├── prisma/
│   └── schema.prisma        # Database schema
├── server.js                # App entry point
├── vercel.json              # Vercel deployment config
└── package.json
```

## 📡 API Endpoints

### 🔐 Auth (`/api/auth`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/register` | Registrasi user baru | ❌ |
| `POST` | `/login` | Login user | ❌ |
| `GET` | `/me` | Get data user yang sedang login | ✅ |

### 👤 User (`/api/user`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `GET` | `/search` | Cari user berdasarkan keyword | ❌ |
| `GET` | `/:username` | Get profil user by username | ❌ |
| `PUT` | `/update-user` | Update data profil | ✅ |
| `PUT` | `/update-photo-profile` | Update foto profil | ✅ |

### 📝 Feed (`/api/feed`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/` | Buat postingan baru | ✅ |
| `GET` | `/` | Lihat semua feed | ✅ |
| `GET` | `/:id` | Detail postingan | ✅ |
| `DELETE` | `/:id` | Hapus postingan | ✅ |

### 👥 Follow (`/api/follow`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/` | Follow user | ✅ |
| `DELETE` | `/:unfollowUserId` | Unfollow user | ✅ |
| `GET` | `/user` | Get suggested users | ✅ |
| `GET` | `/:followUserId` | Cek status follow | ✅ |

### 💬 Comment (`/api/comment`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/` | Tambah komentar | ✅ |
| `DELETE` | `/:commentId` | Hapus komentar | ✅ |

### ❤️ Like (`/api/like`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/:id` | Like / unlike postingan | ✅ |
| `GET` | `/:id` | Cek status like | ✅ |

### 🔖 Bookmark (`/api/bookmark`)
| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|:----:|
| `POST` | `/:postId` | Simpan / hapus bookmark | ✅ |
| `GET` | `/:postId` | Cek status bookmark | ✅ |

## ⚡ Instalasi & Setup

### Prerequisites

- **Node.js** v18+
- **npm** atau **yarn**
- **PostgreSQL** database (atau gunakan [Neon](https://neon.tech))

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/medsos-api.git
cd medsos-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Buat file `.env` di root project:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
JWTSECRET=your_jwt_secret_key
CLOUDNAME=your_cloudinary_cloud_name
CLOUDKEY=your_cloudinary_api_key
CLOUDPASSWORD=your_cloudinary_api_secret
```

### 4️⃣ Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 5️⃣ Jalankan Server

```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000` 🚀

## 🌐 Deployment

Project ini dikonfigurasi untuk deploy ke **Vercel**. Cukup hubungkan repository GitHub ke Vercel dan set environment variables di dashboard Vercel.

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

## 📄 Lisensi

Project ini dilisensikan di bawah lisensi **ISC**.

---

<div align="center">
</div>
]]>
