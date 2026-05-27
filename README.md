# 📱 Medsos API

Medsos API is a modern, high-performance, and secure backend REST API for a social media application. Built on **Node.js** with the **Express.js** framework, it leverages **Prisma ORM** with **PostgreSQL** for efficient database management, **JWT** for authentication, and **Cloudinary** for scalable media storage.

## ✨ Key Features

- **🔐 Robust Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and password hashing with Bcrypt.
- **👤 Profile Management**: Comprehensive user profile management, including updates to user details and avatar uploads.
- **📝 Feed & Post CRUD**: Complete CRUD (Create, Read, Update, Delete) lifecycle for social media posts, with support for image uploads.
- **👥 Social Connections**: Dynamic follow and unfollow system allowing users to connect with one another.
- **💬 Interactive Comments**: Ability for users to add, view, and delete comments on posts.
- **❤️ Post Likes**: Quick interactive feedback with likes and unlikes on posts.
- **🔖 Bookmarks**: Keep track of favorite posts by saving or removing bookmarks.
- **📖 API Documentation**: Auto-generated, interactive Swagger documentation available at the root URL or `/api-docs`.

## 🚀 Technologies Used

- **Framework**: Express.js (Node.js)
- **Database ORM**: Prisma Client
- **Database**: PostgreSQL (e.g., Neon Postgres)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt
- **File Upload & Storage**: Multer & Cloudinary
- **Request Validation**: Zod
- **API Documentation**: Swagger UI Express & Swagger JSDoc
- **Deployment & Hosting**: Vercel ready

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js (version 18+ recommended) and a PostgreSQL database instance ready.

### Installation & Setup

1. **Clone the repository and navigate into the project directory:**
   ```bash
   git clone https://github.com/liunadirizkyh/medsos-api.git
   cd medsos-api
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and configure your keys in the `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in your database connections and Cloudinary API credentials.

4. **Initialize the Database:**
   Run Prisma migrations and push the schema to your database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The server will start, and by default, it will be available at [http://localhost:3000](http://localhost:3000).

6. **Explore API Documentation:**
   Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser to interact with the API endpoints via Swagger.

## 📡 API Routes Reference

| Base Path | Description | Access |
|---|---|---|
| `/api/auth` | User registration, login, and current session fetching | Public / Private |
| `/api/user` | User search, profile details, and avatar updates | Private |
| `/api/feed` | Social feed posts management (CRUD) | Private |
| `/api/follow` | Managing user relationships (Follow / Unfollow) | Private |
| `/api/comment` | Creating and deleting comments on posts | Private |
| `/api/like` | Liking and unliking feed posts | Private |
| `/api/bookmark` | Saving and removing post bookmarks | Private |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or open a pull request.

## 📝 License

This project is licensed under the **ISC License**. See `package.json` for details.
