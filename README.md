# 🎓 Scholarship Portal (Full-Stack Monorepo Application)

Scholarship Portal is a production-ready, full-stack MERN application managed as a unified monorepo. It connects a React 19 frontend with an Express / Node.js backend to provide global undergraduate (BS), masters (MS), and doctorate (PhD) scholarship listings, interactive search, blog guides, an ad management system, and an admin management dashboard.

---

## 📁 Monorepo Project Structure

```text
project/
├── api/                  # Vercel Serverless Function entry point (api/index.js)
├── backend/              # Express backend (routes, controllers, models, config, inMemoryStore)
│   ├── config/           # Database setup and fallback in-memory store
│   ├── controllers/      # API logic for scholarships, blogs, ads, auth, users, etc.
│   ├── models/           # Mongoose schemas & data models
│   ├── routes/           # Express endpoint routers
│   └── server.js         # Core Express application instance
├── public/               # Static assets & icons
├── src/                  # React 19 Frontend (Vite + Tailwind CSS + Lucide React)
├── uploads/              # Stored image upload media
├── .env.example          # Environment variable template
├── package.json          # Monorepo root package configuration
├── README.md             # Project documentation & deployment guide
├── server.ts             # Unified Express + Vite development & production runner
└── vercel.json           # Vercel serverless routing configuration
```

---

## 🛠 Available Scripts

Run all commands from the project root:

- `npm install` — Installs all dependencies for both frontend and backend.
- `npm run dev` — Launches the unified development server running both Express API endpoints and Vite frontend on port `3000`.
- `npm run dev:concurrent` — Runs backend (`node backend/server.js`) and frontend (`vite`) concurrently using `concurrently`.
- `npm run frontend` — Starts only the Vite frontend dev server.
- `npm run backend` — Starts only the Express backend server.
- `npm run build` — Builds the Vite production bundle (`dist/`) and bundles the server entry point (`dist/server.cjs`).
- `npm run start` — Boots the standalone production server serving compiled static assets and Express API routes.
- `npm run lint` — Runs TypeScript type-checking (`tsc --noEmit`).

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory using `.env.example`:

```env
# Optional Frontend API base URL (defaults to same-origin / relative API paths)
VITE_API_URL=

# MongoDB Connection String (Supports MONGODB_URI, MONGO_URI, or DATABASE_URL)
MONGODB_URI=mongodb+srv://techhub905_db_user:lE6ZJ2Ygh5sujI1t@cluster0.efqbfvq.mongodb.net/scholarship_portal?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://techhub905_db_user:lE6ZJ2Ygh5sujI1t@cluster0.efqbfvq.mongodb.net/scholarship_portal?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=scholarship_portal_super_secret_jwt_key_2026

# Node Environment
NODE_ENV=production
```

---

## 🚀 Single-Folder Deployment Guide

### Deploying to Vercel (Single Root Folder)
1. Import this repository into Vercel with Root Directory set to `./`.
2. Vercel automatically detects `vercel.json` and `api/index.js`.
3. All `/api/*` HTTP requests are routed to the Express API serverless function (`api/index.js`), while all frontend routes are served via Vite static output.
4. Add `MONGODB_URI` and `JWT_SECRET` under Vercel Project Settings -> Environment Variables.

### Deploying to Render / Railway / Docker
1. Select Node Web Service and set build command to `npm run build`.
2. Set start command to `npm run start`.
3. Set environment variable `PORT=3000`.

---

## 🔐 Default Admin & Student Accounts

- **Admin Account:**
  - **Email:** `admin@scholarship.org`
  - **Password:** `admin123`
- **Student Account:**
  - **Email:** `user@scholarship.org`
  - **Password:** `user123`
