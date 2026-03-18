# Medsos API

Backend REST API untuk aplikasi media sosial.

## Tech Stack

- Node.js & Express.js
- PostgreSQL (Neon) & Prisma
- JWT & Bcrypt (Authentication)
- Cloudinary & Multer (Image Upload)
- Zod (Validation)
- Vercel (Deployment)

## Fitur

- 🔐 Register & Login dengan JWT
- 👤 Profil pengguna & update avatar
- 📝 CRUD postingan dengan gambar
- 👥 Follow & unfollow
- 💬 Komentar
- ❤️ Like
- 🔖 Bookmark

## API Endpoints

| Base Path | Deskripsi |
|---|---|
| `/api/auth` | Register, Login, Get current user |
| `/api/user` | Pencarian user, profil, update avatar |
| `/api/feed` | CRUD postingan |
| `/api/follow` | Follow & unfollow user |
| `/api/comment` | Tambah & hapus komentar |
| `/api/like` | Like & unlike postingan |
| `/api/bookmark` | Simpan & hapus bookmark |

## Instalasi

```bash
# Clone & install
git clone https://github.com/username/medsos-api.git
cd medsos-api
npm install

# Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi database & cloudinary

# Setup database
npx prisma generate
npx prisma db push

# Jalankan server
npm run dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWTSECRET=your_jwt_secret
CLOUDNAME=your_cloudinary_name
CLOUDKEY=your_cloudinary_key
CLOUDPASSWORD=your_cloudinary_secret
```
