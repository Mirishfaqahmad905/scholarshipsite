# Scholarship Portal (MERN Stack Web Application)

Scholarship Portal is a full-featured MERN stack application designed to list global undergraduate (BS), masters (MS), and doctorate (PhD) scholarships filtered by country and category. The platform includes a blog section, ad banner manager, and a full admin dashboard.

---

## 🚀 Features

- **Scholarship Directory:** Searchable and filterable by **Degree Level** (BS/MS/PhD), **Country** (China, USA, Finland, UK, Canada, Germany, Australia, etc.), **Category**, **Funding Type** (Full/Partial), and **Status** (Open/Closed).
- **Scholarship Details:** Deadline countdowns, funding badges, official portal links, direct application links, and related opportunities.
- **Blog & Articles Section:** Educational guides, essay writing tips, and CSC application walk-throughs.
- **Ad Banner System:** Reusable `<AdBanner placement="..." />` slots (`header`, `sidebar`, `in-feed`, `footer`) managed from admin.
- **Admin Dashboard:** Role-protected admin dashboard (`role === 'admin'`) for full CRUD management on scholarships, blogs, ads, users, categories, and countries.
- **Image Uploads:** Powered by Multer storing files on disk under `/uploads/`, served as static assets.
- **JWT Auth & Password Encryption:** Secure authentication using JWT and `bcryptjs`.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, Mongoose (MongoDB), JWT, Multer
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router v6

---

## ⚙️ Environment Configuration

Copy `backend/.env.example` to `backend/.env` (or project root `.env`):

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

---

## 🏃 Getting Started

### Unified Runner (Container / Port 3000)

```bash
# Install root dependencies
npm install

# Start unified dev server (Express backend + Vite frontend)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Demo Accounts

- **Admin Account:**
  - **Email:** `admin@scholarship.org`
  - **Password:** `admin123`
- **Student Account:**
  - **Email:** `user@scholarship.org`
  - **Password:** `user123`
